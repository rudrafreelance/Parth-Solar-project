<script setup>
import { computed, ref, watch } from 'vue'
import { ExternalLink, Search } from '@lucide/vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { financialYearForDate, formatInr, listFinancialYears } from '@/lib/billingMath'
import { supabase } from '@/lib/supabase'

const { session } = useAdminAuth()
const years = listFinancialYears(6)
const fy = ref(financialYearForDate(new Date()))
const type = ref('all')
const q = ref('')
const bills = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  const userId = session.value?.user?.id
  if (!userId || !supabase) {
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  let query = supabase
    .from('bills')
    .select('id, bill_type, invoice_no, invoice_date, party_name, grand_total, pdf_url, financial_year')
    .eq('user_id', userId)
    .eq('financial_year', fy.value)
    .order('invoice_date', { ascending: false })

  if (type.value !== 'all') query = query.eq('bill_type', type.value)

  const { data, error: qErr } = await query
  if (qErr) error.value = qErr.message
  else bills.value = data || []
  loading.value = false
}

watch([fy, type], load, { immediate: true })

const filtered = computed(() => {
  const hayQ = q.value.trim().toLowerCase()
  return bills.value.filter((b) => `${b.party_name} ${b.invoice_no}`.toLowerCase().includes(hayQ))
})
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-5">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Invoices</p>
        <h2 class="mt-1 text-3xl font-bold text-emerald-950">Bills</h2>
      </div>
      <div class="flex gap-2">
        <RouterLink
          to="/billing/bills/new/sale"
          class="rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white"
        >
          New sale
        </RouterLink>
        <RouterLink
          to="/billing/bills/new/purchase"
          class="rounded-full border border-emerald-950/15 bg-white px-4 py-2.5 text-sm font-bold text-emerald-950"
        >
          New purchase
        </RouterLink>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 rounded-3xl border border-emerald-950/10 bg-white p-4">
      <label class="text-sm font-semibold text-emerald-950">
        FY
        <select v-model="fy" class="ml-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </label>
      <label class="text-sm font-semibold text-emerald-950">
        Type
        <select v-model="type" class="ml-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <option value="all">All</option>
          <option value="sale">Sale</option>
          <option value="purchase">Purchase</option>
        </select>
      </label>
      <label class="relative min-w-[220px] flex-1 text-sm font-semibold text-emerald-950">
        Search party / invoice
        <span class="relative mt-1 block">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            v-model="q"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3"
            placeholder="RK ENTERPRISE / 0003"
          />
        </span>
      </label>
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <div class="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white">
      <div v-if="loading" class="space-y-3 p-5">
        <div v-for="n in 5" :key="n" class="h-10 animate-pulse rounded-xl bg-emerald-950/5" />
      </div>
      <p v-else-if="filtered.length === 0" class="p-8 text-center text-sm text-slate-600">
        No bills in this filter.
      </p>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-emerald-950/5 text-emerald-900">
            <tr>
              <th class="px-4 py-3 font-bold">Type</th>
              <th class="px-4 py-3 font-bold">Invoice</th>
              <th class="px-4 py-3 font-bold">Date</th>
              <th class="px-4 py-3 font-bold">Party</th>
              <th class="px-4 py-3 font-bold">Total</th>
              <th class="px-4 py-3 font-bold">PDF</th>
              <th class="px-4 py-3 font-bold" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="bill in filtered" :key="bill.id" class="border-t border-emerald-950/8">
              <td class="px-4 py-3 capitalize">{{ bill.bill_type }}</td>
              <td class="px-4 py-3 font-semibold">{{ bill.invoice_no }}</td>
              <td class="px-4 py-3">{{ bill.invoice_date }}</td>
              <td class="px-4 py-3">{{ bill.party_name }}</td>
              <td class="px-4 py-3">{{ formatInr(bill.grand_total) }}</td>
              <td class="px-4 py-3">
                <a
                  v-if="bill.pdf_url"
                  :href="bill.pdf_url"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:underline"
                >
                  Open PDF <ExternalLink class="h-3.5 w-3.5" />
                </a>
                <span v-else class="text-slate-400">—</span>
              </td>
              <td class="px-4 py-3">
                <RouterLink
                  :to="`/billing/bills/${bill.id}/edit`"
                  class="font-semibold text-emerald-800 hover:underline"
                >
                  Edit
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
