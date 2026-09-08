<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { supabase } from '@/lib/supabase'

const defaults = {
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

const fields = [
  ['business_name', 'Business name'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['gstin', 'GSTIN'],
  ['pan', 'PAN'],
  ['bank_account_name', 'Bank account name'],
  ['bank_account_no', 'Account number'],
  ['bank_name', 'Bank name'],
  ['bank_ifsc', 'IFSC'],
  ['state_name', 'State'],
  ['state_code', 'State code'],
]

const { session } = useAdminAuth()
const form = reactive({ ...defaults })
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref('')

onMounted(async () => {
  const userId = session.value?.user?.id
  if (!userId || !supabase) {
    loading.value = false
    return
  }
  const { data, error: qErr } = await supabase
    .from('company_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (qErr) error.value = qErr.message
  else if (data) Object.assign(form, { ...defaults, ...data })
  loading.value = false
})

async function onSubmit() {
  const userId = session.value?.user?.id
  saving.value = true
  error.value = ''
  message.value = ''
  const payload = {
    user_id: userId,
    business_name: form.business_name.trim(),
    address: form.address.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    gstin: form.gstin.trim(),
    pan: form.pan.trim(),
    bank_name: form.bank_name.trim(),
    bank_account_name: form.bank_account_name.trim(),
    bank_account_no: form.bank_account_no.trim(),
    bank_ifsc: form.bank_ifsc.trim(),
    state_name: form.state_name.trim(),
    state_code: form.state_code.trim(),
    updated_at: new Date().toISOString(),
  }
  const { error: saveErr } = await supabase.from('company_settings').upsert(payload, { onConflict: 'user_id' })
  saving.value = false
  if (saveErr) error.value = saveErr.message
  else message.value = 'Company profile saved.'
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-5">
    <div>
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Company</p>
      <h2 class="mt-1 text-3xl font-bold text-emerald-950">Settings</h2>
      <p class="mt-2 text-sm text-slate-600">These details print on Ideal Energy sale invoices.</p>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 6" :key="n" class="h-12 animate-pulse rounded-xl bg-emerald-950/5" />
    </div>

    <template v-else>
      <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
      <p v-if="message" class="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{{ message }}</p>

      <form
        class="grid gap-3 rounded-3xl border border-emerald-950/10 bg-white p-5 sm:grid-cols-2"
        @submit.prevent="onSubmit"
      >
        <label v-for="[key, label] in fields" :key="key" class="text-sm font-bold text-emerald-950">
          {{ label }}
          <input
            v-model="form[key]"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label class="text-sm font-bold text-emerald-950 sm:col-span-2">
          Address
          <textarea
            v-model="form.address"
            rows="3"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <button
          type="submit"
          class="rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60 sm:col-span-2"
          :disabled="saving"
        >
          {{ saving ? 'Saving…' : 'Save company profile' }}
        </button>
      </form>
    </template>
  </div>
</template>
