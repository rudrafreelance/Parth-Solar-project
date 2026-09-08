<script setup>
import { computed, onMounted, ref } from 'vue'
import { ExternalLink, FilePlus2 } from '@lucide/vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { formatInr } from '@/lib/billingMath'
import { supabase } from '@/lib/supabase'

function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const iso = (d) => d.toISOString().slice(0, 10)
  return { start: iso(start), end: iso(end) }
}

const { session } = useAdminAuth()
const loading = ref(true)
const error = ref('')
const bills = ref([])
const range = monthRange()

onMounted(async () => {
  const userId = session.value?.user?.id
  if (!userId || !supabase) {
    loading.value = false
    return
  }
  const { data, error: qErr } = await supabase
    .from('bills')
    .select('id, bill_type, invoice_no, invoice_date, party_name, grand_total, pdf_url')
    .eq('user_id', userId)
    .order('invoice_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(40)
  if (qErr) error.value = qErr.message
  else bills.value = data || []
  loading.value = false
})

const monthBills = computed(() =>
  bills.value.filter((b) => b.invoice_date >= range.start && b.invoice_date <= range.end),
)
const saleTotal = computed(() =>
  monthBills.value
    .filter((b) => b.bill_type === 'sale')
    .reduce((s, b) => s + Number(b.grand_total || 0), 0),
)
const purchaseTotal = computed(() =>
  monthBills.value
    .filter((b) => b.bill_type === 'purchase')
    .reduce((s, b) => s + Number(b.grand_total || 0), 0),
)
const recent = computed(() => bills.value.slice(0, 5))
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Overview</p>
        <h2 class="mt-1 text-3xl font-bold text-emerald-950">Dashboard</h2>
      </div>
      <div class="flex gap-2">
        <RouterLink
          to="/billing/bills/new/sale"
          class="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white"
        >
          <FilePlus2 class="h-4 w-4" /> New sale
        </RouterLink>
        <RouterLink
          to="/billing/bills/new/purchase"
          class="inline-flex items-center gap-2 rounded-full border border-emerald-950/15 bg-white px-4 py-2.5 text-sm font-bold text-emerald-950"
        >
          <FilePlus2 class="h-4 w-4" /> New purchase
        </RouterLink>
      </div>
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="h-14 animate-pulse rounded-2xl bg-emerald-950/5" />
    </div>

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-3xl bg-lime-300 p-6 text-emerald-950 shadow-sm">
          <p class="text-sm font-semibold text-emerald-900/70">This month · Sales</p>
          <p class="mt-2 text-3xl font-bold">{{ formatInr(saleTotal) }}</p>
        </div>
        <div class="rounded-3xl bg-[#071c16] p-6 text-white shadow-sm">
          <p class="text-sm font-semibold text-white/65">This month · Purchases</p>
          <p class="mt-2 text-3xl font-bold">{{ formatInr(purchaseTotal) }}</p>
        </div>
      </div>

      <section class="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm sm:p-6">
        <h3 class="text-lg font-bold text-emerald-950">Recent bills</h3>
        <p v-if="recent.length === 0" class="mt-4 text-sm text-slate-600">
          No bills yet. Create a sale or purchase invoice.
        </p>
        <ul v-else class="mt-4 divide-y divide-emerald-950/8">
          <li
            v-for="bill in recent"
            :key="bill.id"
            class="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div>
              <p class="font-semibold text-emerald-950">
                {{ bill.bill_type === 'sale' ? 'Sale' : 'Purchase' }} · {{ bill.invoice_no }}
              </p>
              <p class="text-sm text-slate-600">
                {{ bill.party_name }} · {{ bill.invoice_date }} · {{ formatInr(bill.grand_total) }}
              </p>
            </div>
            <div class="flex gap-2">
              <RouterLink
                :to="`/billing/bills/${bill.id}/edit`"
                class="rounded-full border border-emerald-950/15 px-3 py-1.5 text-xs font-bold text-emerald-950"
              >
                Edit
              </RouterLink>
              <a
                v-if="bill.pdf_url"
                :href="bill.pdf_url"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-3 py-1.5 text-xs font-bold text-white"
              >
                Open PDF <ExternalLink class="h-3 w-3" />
              </a>
              <span v-else class="text-xs text-slate-400">No PDF</span>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
