<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Trash2 } from '@lucide/vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { calcBillTotals, calcLine, financialYearForDate } from '@/lib/billingMath'
import { generateAndUploadBillPdf } from '@/lib/billingPdf'
import { buildWhatsAppLink } from '@/lib/billingWhatsapp'
import { supabase } from '@/lib/supabase'
import CurrencyInput from '@/components/ui/CurrencyInput.vue'

const emptyLine = () => ({
  item_id: '',
  description: '',
  hsn: '',
  qty: 1,
  unit: 'NOS',
  rate: 0,
  gst_rate: 18,
  amount: 0,
  cgst_rate: 9,
  sgst_rate: 9,
  cgst_amount: 0,
  sgst_amount: 0,
})

function applyLineMath(line) {
  return { ...line, ...calcLine(line.qty, line.rate, line.gst_rate) }
}

const route = useRoute()
const router = useRouter()
const { session } = useAdminAuth()

const isEdit = computed(() => Boolean(route.params.id))
const billTypeParam = computed(() =>
  route.params.type === 'purchase' ? 'purchase' : 'sale',
)

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const fieldErrors = reactive({})
const parties = ref([])
const items = ref([])
const company = ref(null)
const existingPath = ref('')
const existingId = ref(route.params.id || '')

const form = reactive({
  bill_type: 'sale',
  invoice_no: '',
  invoice_date: new Date().toISOString().slice(0, 10),
  party_id: '',
  party_name: '',
  party_gstin: '',
  party_address: '',
  party_phone: '',
  party_state_name: 'Gujarat',
  party_state_code: '24',
  irn: '',
  ack_no: '',
  ack_date: '',
  eway_bill_no: '',
  vehicle_no: '',
  notes: '',
})

const lines = ref([applyLineMath(emptyLine())])
const totals = computed(() => calcBillTotals(lines.value))

const filteredParties = computed(() =>
  parties.value.filter(
    (p) => p.party_type === (form.bill_type === 'purchase' ? 'supplier' : 'customer'),
  ),
)

const whatsappHref = computed(() =>
  buildWhatsAppLink(
    form.party_phone,
    `Hello ${form.party_name}, please find Ideal Energy invoice ${form.invoice_no}.`,
  ),
)

onMounted(async () => {
  const userId = session.value?.user?.id
  if (!userId || !supabase) {
    loading.value = false
    return
  }

  form.bill_type = isEdit.value ? 'sale' : billTypeParam.value
  const partyType = form.bill_type === 'purchase' ? 'supplier' : 'customer'

  const [partyRes, itemRes, companyRes] = await Promise.all([
    supabase.from('parties').select('*').eq('user_id', userId).order('name'),
    supabase.from('items').select('*').eq('user_id', userId).order('name'),
    supabase.from('company_settings').select('*').eq('user_id', userId).maybeSingle(),
  ])

  if (partyRes.error || itemRes.error) {
    error.value = partyRes.error?.message || itemRes.error?.message
    loading.value = false
    return
  }

  parties.value = isEdit.value
    ? partyRes.data || []
    : (partyRes.data || []).filter((p) => p.party_type === partyType)
  items.value = itemRes.data || []
  company.value =
    companyRes.data || {
      business_name: 'IDEAL ENERGY',
      address: 'B/4/41 VAIKUTH CO OP HOU SOC LTD, NR.CADILA BRIDEG GHODASAR AHMEDABAD',
      phone: '+91 6355859771',
      email: 'Idealeneergy@gmail.com',
      gstin: '24JMFPK6119C1Z8',
      pan: 'JMFPK6119C',
      bank_name: 'INDUSIND BANK',
      bank_account_name: 'IDEAL ENERGY',
      bank_account_no: '251010190313',
      bank_ifsc: 'INDB0000727',
      state_name: 'Gujarat',
      state_code: '24',
    }

  if (isEdit.value) {
    const { data: bill, error: billErr } = await supabase
      .from('bills')
      .select('*, bill_items(*)')
      .eq('id', route.params.id)
      .eq('user_id', userId)
      .single()
    if (billErr) {
      error.value = billErr.message
      loading.value = false
      return
    }
    existingId.value = bill.id
    existingPath.value = bill.pdf_path || ''
    Object.assign(form, {
      bill_type: bill.bill_type,
      invoice_no: bill.invoice_no,
      invoice_date: bill.invoice_date,
      party_id: bill.party_id || '',
      party_name: bill.party_name,
      party_gstin: bill.party_gstin,
      party_address: bill.party_address,
      party_phone: bill.party_phone,
      party_state_name: bill.party_state_name,
      party_state_code: bill.party_state_code,
      irn: bill.irn || '',
      ack_no: bill.ack_no || '',
      ack_date: bill.ack_date || '',
      eway_bill_no: bill.eway_bill_no || '',
      vehicle_no: bill.vehicle_no || '',
      notes: bill.notes || '',
    })
    const loaded = (bill.bill_items || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((row) =>
        applyLineMath({
          item_id: row.item_id || '',
          description: row.description,
          hsn: row.hsn,
          qty: row.qty,
          unit: row.unit,
          rate: row.rate,
          gst_rate: row.gst_rate,
        }),
      )
    lines.value = loaded.length ? loaded : [applyLineMath(emptyLine())]
    parties.value = partyRes.data || []
  } else if (form.bill_type === 'sale') {
    const { data: nextNo, error: nextErr } = await supabase.rpc('next_sale_invoice_no', {
      p_user_id: userId,
      p_date: form.invoice_date,
    })
    if (nextErr) error.value = nextErr.message
    else form.invoice_no = nextNo
  }

  loading.value = false
})

function updateLine(index, patch) {
  lines.value = lines.value.map((line, i) =>
    i === index ? applyLineMath({ ...line, ...patch }) : line,
  )
}

function pickParty(partyId) {
  const party = parties.value.find((p) => p.id === partyId)
  if (!party) {
    form.party_id = ''
    return
  }
  form.party_id = party.id
  form.party_name = party.name
  form.party_gstin = party.gstin
  form.party_address = party.address
  form.party_phone = party.phone
  form.party_state_name = party.state_name
  form.party_state_code = party.state_code
}

function pickItem(index, itemId) {
  const item = items.value.find((i) => i.id === itemId)
  if (!item) {
    updateLine(index, { item_id: '' })
    return
  }
  updateLine(index, {
    item_id: item.id,
    description: item.name,
    hsn: item.hsn,
    unit: item.unit,
    rate: item.default_rate,
    gst_rate: item.default_gst_rate,
  })
}

function addLine() {
  lines.value = [...lines.value, applyLineMath(emptyLine())]
}

function removeLine(index) {
  if (lines.value.length === 1) return
  lines.value = lines.value.filter((_, i) => i !== index)
}

function validate() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
  if (!form.party_name.trim()) fieldErrors.party = 'Select or enter a party'
  if (!form.invoice_no.trim()) fieldErrors.invoice_no = 'Invoice number is required'
  if (!form.invoice_date) fieldErrors.invoice_date = 'Date is required'
  const validLines = lines.value.filter(
    (l) => l.description.trim() && Number(l.qty) > 0 && Number(l.rate) > 0,
  )
  if (!validLines.length) fieldErrors.lines = 'Add at least one line with description, qty and rate > 0'
  return { ok: Object.keys(fieldErrors).length === 0, validLines }
}

async function ensureCompanyRow(userId) {
  if (company.value?.id) return company.value
  const payload = {
    user_id: userId,
    business_name: company.value.business_name,
    address: company.value.address,
    phone: company.value.phone,
    email: company.value.email,
    gstin: company.value.gstin,
    pan: company.value.pan,
    bank_name: company.value.bank_name,
    bank_account_name: company.value.bank_account_name,
    bank_account_no: company.value.bank_account_no,
    bank_ifsc: company.value.bank_ifsc,
    state_name: company.value.state_name,
    state_code: company.value.state_code,
  }
  const { data, error: upsertErr } = await supabase
    .from('company_settings')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single()
  if (upsertErr) throw upsertErr
  company.value = data
  return data
}

async function onSave(generatePdf) {
  error.value = ''
  const { ok, validLines } = validate()
  if (!ok) return

  const userId = session.value?.user?.id
  saving.value = true
  try {
    const companyRow = await ensureCompanyRow(userId)
    const fy = financialYearForDate(form.invoice_date)
    const totalsNow = calcBillTotals(validLines)

    const billPayload = {
      user_id: userId,
      bill_type: form.bill_type,
      invoice_no: form.invoice_no.trim(),
      invoice_date: form.invoice_date,
      party_id: form.party_id || null,
      party_name: form.party_name.trim(),
      party_gstin: form.party_gstin.trim(),
      party_address: form.party_address.trim(),
      party_phone: form.party_phone.trim(),
      party_state_name: form.party_state_name,
      party_state_code: form.party_state_code,
      taxable_total: totalsNow.taxable_total,
      cgst_total: totalsNow.cgst_total,
      sgst_total: totalsNow.sgst_total,
      round_off: totalsNow.round_off,
      grand_total: totalsNow.grand_total,
      amount_in_words: totalsNow.amount_in_words,
      irn: form.irn,
      ack_no: form.ack_no,
      ack_date: form.ack_date || null,
      eway_bill_no: form.eway_bill_no,
      vehicle_no: form.vehicle_no,
      notes: form.notes,
      financial_year: fy,
      updated_at: new Date().toISOString(),
    }

    let billId = existingId.value
    if (isEdit.value || existingId.value) {
      const { error: upErr } = await supabase
        .from('bills')
        .update(billPayload)
        .eq('id', billId)
        .eq('user_id', userId)
      if (upErr) throw upErr
      const { error: delErr } = await supabase.from('bill_items').delete().eq('bill_id', billId)
      if (delErr) throw delErr
    } else {
      const { data: created, error: insErr } = await supabase
        .from('bills')
        .insert(billPayload)
        .select('id')
        .single()
      if (insErr) throw insErr
      billId = created.id
      existingId.value = billId
    }

    const itemRows = validLines.map((line, index) => ({
      bill_id: billId,
      item_id: line.item_id || null,
      description: line.description.trim(),
      hsn: line.hsn,
      qty: Number(line.qty),
      unit: line.unit,
      rate: Number(line.rate),
      amount: Number(line.amount),
      gst_rate: Number(line.gst_rate),
      cgst_rate: Number(line.cgst_rate),
      sgst_rate: Number(line.sgst_rate),
      cgst_amount: Number(line.cgst_amount),
      sgst_amount: Number(line.sgst_amount),
      sort_order: index,
    }))
    const { error: itemsErr } = await supabase.from('bill_items').insert(itemRows)
    if (itemsErr) throw itemsErr

    if (generatePdf) {
      const uploaded = await generateAndUploadBillPdf({
        userId,
        company: companyRow,
        bill: { ...billPayload, id: billId },
        lines: itemRows,
        existingPath: existingPath.value || undefined,
      })
      existingPath.value = uploaded.pdf_path
      const { error: pdfErr } = await supabase
        .from('bills')
        .update({ pdf_url: uploaded.pdf_url, pdf_path: uploaded.pdf_path })
        .eq('id', billId)
      if (pdfErr) throw pdfErr
      window.open(uploaded.pdf_url, '_blank', 'noopener,noreferrer')
    }

    router.push('/billing/bills')
  } catch (err) {
    error.value = err.message || 'Could not save bill'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-5">
    <div v-if="loading" class="space-y-3 py-10">
      <div v-for="n in 6" :key="n" class="h-12 animate-pulse rounded-xl bg-emerald-950/5" />
    </div>

    <template v-else>
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            {{ form.bill_type === 'sale' ? 'Sale invoice' : 'Purchase invoice' }}
          </p>
          <h2 class="mt-1 text-3xl font-bold text-emerald-950">
            {{ isEdit ? 'Edit bill' : 'Create bill' }}
          </h2>
        </div>
        <RouterLink to="/billing/bills" class="text-sm font-semibold text-emerald-800 hover:underline">
          Back to list
        </RouterLink>
      </div>

      <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

      <div class="grid gap-4 rounded-3xl border border-emerald-950/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <label class="text-sm font-bold text-emerald-950">
          Invoice no.
          <input
            v-model="form.invoice_no"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
          <span v-if="fieldErrors.invoice_no" class="mt-1 block text-xs text-red-600">{{
            fieldErrors.invoice_no
          }}</span>
        </label>
        <label class="text-sm font-bold text-emerald-950">
          Invoice date
          <input
            v-model="form.invoice_date"
            type="date"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label class="text-sm font-bold text-emerald-950">
          Party
          <select
            :value="form.party_id"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
            @change="pickParty($event.target.value)"
          >
            <option value="">Select party</option>
            <option v-for="p in filteredParties" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
          <span v-if="fieldErrors.party" class="mt-1 block text-xs text-red-600">{{
            fieldErrors.party
          }}</span>
        </label>
        <label class="text-sm font-bold text-emerald-950 sm:col-span-2">
          Party name
          <input
            v-model="form.party_name"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label class="text-sm font-bold text-emerald-950">
          Party GSTIN
          <input
            v-model="form.party_gstin"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label class="text-sm font-bold text-emerald-950 sm:col-span-2 lg:col-span-3">
          Party address
          <textarea
            v-model="form.party_address"
            rows="2"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>

        <template v-if="form.bill_type === 'purchase'">
          <label class="text-sm font-bold text-emerald-950">
            IRN
            <input v-model="form.irn" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </label>
          <label class="text-sm font-bold text-emerald-950">
            Ack No.
            <input v-model="form.ack_no" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </label>
          <label class="text-sm font-bold text-emerald-950">
            Ack date
            <input
              v-model="form.ack_date"
              type="date"
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
            />
          </label>
        </template>

        <label class="text-sm font-bold text-emerald-950">
          E-way bill
          <input
            v-model="form.eway_bill_no"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label class="text-sm font-bold text-emerald-950">
          Vehicle no.
          <input
            v-model="form.vehicle_no"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
      </div>

      <div class="rounded-3xl border border-emerald-950/10 bg-white p-5">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-lg font-bold text-emerald-950">Line items</h3>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-full bg-lime-300 px-3 py-1.5 text-xs font-bold text-emerald-950"
            @click="addLine"
          >
            <Plus class="h-3.5 w-3.5" /> Add line
          </button>
        </div>
        <p v-if="fieldErrors.lines" class="mt-2 text-xs text-red-600">{{ fieldErrors.lines }}</p>

        <div class="mt-4 space-y-4">
          <div
            v-for="(line, index) in lines"
            :key="index"
            class="grid gap-2 rounded-2xl bg-[#f3f6ef] p-3 sm:grid-cols-6"
          >
            <label class="text-xs font-bold text-emerald-950 sm:col-span-2">
              Catalog item
              <select
                :value="line.item_id"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                @change="pickItem(index, $event.target.value)"
              >
                <option value="">Custom</option>
                <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </label>
            <label class="text-xs font-bold text-emerald-950 sm:col-span-2">
              Description
              <input
                :value="line.description"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                @input="updateLine(index, { description: $event.target.value })"
              />
            </label>
            <label class="text-xs font-bold text-emerald-950">
              HSN
              <input
                :value="line.hsn"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                @input="updateLine(index, { hsn: $event.target.value })"
              />
            </label>
            <label class="text-xs font-bold text-emerald-950">
              GST %
              <select
                :value="line.gst_rate"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                @change="updateLine(index, { gst_rate: Number($event.target.value) })"
              >
                <option :value="5">5% (2.5+2.5)</option>
                <option :value="12">12% (6+6)</option>
                <option :value="18">18% (9+9)</option>
                <option :value="24">24% (12+12)</option>
                <option :value="28">28% (14+14)</option>
              </select>
            </label>
            <label class="text-xs font-bold text-emerald-950">
              Qty
              <input
                :value="line.qty"
                type="number"
                min="0"
                step="0.001"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                @input="updateLine(index, { qty: $event.target.value })"
              />
            </label>
            <label class="text-xs font-bold text-emerald-950">
              Unit
              <input
                :value="line.unit"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                @input="updateLine(index, { unit: $event.target.value })"
              />
            </label>
            <label class="text-xs font-bold text-emerald-950">
              Rate
              <CurrencyInput
                :model-value="line.rate"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                placeholder="0.00"
                @update:model-value="updateLine(index, { rate: $event })"
              />
            </label>
            <div class="flex items-end justify-between gap-2 sm:col-span-2">
              <p class="text-sm font-semibold text-emerald-950">
                Amt ₹{{ Number(line.amount || 0).toFixed(2) }}
              </p>
              <button
                type="button"
                class="rounded-lg border border-red-200 p-2 text-red-600"
                @click="removeLine(index)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-5 grid gap-1 text-sm text-emerald-950 sm:justify-items-end">
          <p>Taxable: ₹{{ totals.taxable_total.toFixed(2) }}</p>
          <p>CGST: ₹{{ totals.cgst_total.toFixed(2) }} · SGST: ₹{{ totals.sgst_total.toFixed(2) }}</p>
          <p>Round off: ₹{{ totals.round_off.toFixed(2) }}</p>
          <p class="text-lg font-bold">Grand total: ₹{{ totals.grand_total.toFixed(2) }}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-full border border-emerald-950/15 bg-white px-5 py-3 text-sm font-bold text-emerald-950 disabled:opacity-60"
          :disabled="saving"
          @click="onSave(false)"
        >
          {{ saving ? 'Saving…' : 'Save draft' }}
        </button>
        <button
          type="button"
          class="rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          :disabled="saving"
          @click="onSave(true)"
        >
          {{ saving ? 'Working…' : 'Generate PDF & save' }}
        </button>
        <a
          v-if="form.party_phone"
          :href="whatsappHref"
          target="_blank"
          rel="noreferrer"
          class="rounded-full bg-[#25d366] px-5 py-3 text-sm font-bold text-white"
        >
          WhatsApp party
        </a>
      </div>
    </template>
  </div>
</template>
