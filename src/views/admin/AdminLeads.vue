<script setup>
import { computed, onMounted, ref } from 'vue'
import { Trash2 } from '@lucide/vue'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

const leads = ref([])
const loading = ref(true)
const message = ref('')
const sourceFilter = ref('all')
const statusFilter = ref('all')

async function fetchLeads() {
  loading.value = true
  message.value = ''

  if (!supabase) {
    message.value = 'Supabase is not configured.'
    loading.value = false
    return
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    message.value = error.message.includes('relation')
      ? 'Leads table missing. Run supabase/schema.sql (or add-lead-attribution.sql) in Supabase SQL Editor.'
      : error.message
    leads.value = []
  } else {
    leads.value = data || []
  }

  loading.value = false
}

const sourceOptions = computed(() => {
  const set = new Set(leads.value.map((l) => l.source).filter(Boolean))
  return ['all', ...Array.from(set).sort()]
})

const filteredLeads = computed(() =>
  leads.value.filter((lead) => {
    if (sourceFilter.value !== 'all' && lead.source !== sourceFilter.value) return false
    if (statusFilter.value !== 'all' && (lead.status || 'new') !== statusFilter.value) return false
    return true
  }),
)

async function markStatus(lead, status) {
  if (!supabase) return
  const { error } = await supabase.from('leads').update({ status }).eq('id', lead.id)
  if (!error) await fetchLeads()
}

async function deleteLead(lead) {
  if (!supabase) return
  if (!window.confirm(`Delete lead from ${lead.first_name || 'this contact'}?`)) return
  const { error } = await supabase.from('leads').delete().eq('id', lead.id)
  if (!error) await fetchLeads()
}

function attributionLine(lead) {
  const parts = [
    lead.source,
    lead.utm_campaign ? `campaign: ${lead.utm_campaign}` : null,
    lead.utm_medium ? `medium: ${lead.utm_medium}` : null,
    lead.utm_source && lead.utm_source !== lead.source ? `utm: ${lead.utm_source}` : null,
  ].filter(Boolean)
  return parts.join(' · ')
}

onMounted(fetchLeads)
</script>

<template>
  <div>
    <p class="text-sm text-slate-600">
      Enquiries from the contact form and solar calculator. Filter by source (ads, organic, calculator) to see what drives growth.
    </p>
    <p class="mt-2 text-xs leading-5 text-slate-500">
      Google Ads final URL:
      <code class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-emerald-900">/go/solar?utm_source=google&amp;utm_medium=cpc&amp;utm_campaign=rooftop_gujarat</code>
      — those leads appear as <strong class="font-semibold">google_ads</strong>.
    </p>

    <div v-if="leads.length" class="mt-6 flex flex-wrap gap-3">
      <label class="text-sm">
        <span class="sr-only">Filter by source</span>
        <select
          v-model="sourceFilter"
          class="rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-950"
        >
          <option v-for="option in sourceOptions" :key="option" :value="option">
            {{ option === 'all' ? 'All sources' : option }}
          </option>
        </select>
      </label>
      <label class="text-sm">
        <span class="sr-only">Filter by status</span>
        <select
          v-model="statusFilter"
          class="rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-950"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="site_visit">Site visit</option>
          <option value="quote">Quote</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </label>
      <p class="self-center text-xs text-slate-500">{{ filteredLeads.length }} shown</p>
    </div>

    <p v-if="message" class="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ message }}</p>
    <p v-else-if="loading" class="mt-8 text-slate-600">Loading leads…</p>
    <p v-else-if="!leads.length" class="mt-8 rounded-[1.75rem] border border-dashed border-emerald-950/15 bg-white px-6 py-12 text-center text-slate-600">
      No leads yet. Test the contact form, calculator, or Google Ads landing
      <code class="text-emerald-800">/go/solar</code>
      after connecting Supabase.
    </p>
    <p v-else-if="!filteredLeads.length" class="mt-8 text-slate-600">No leads match these filters.</p>

    <ul v-else class="mt-8 space-y-4">
      <li
        v-for="lead in filteredLeads"
        :key="lead.id"
        class="rounded-[1.5rem] border border-emerald-950/10 bg-white p-5 sm:p-6"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="text-left">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-lg font-bold text-emerald-950">
                {{ lead.first_name }} {{ lead.last_name }}
              </h2>
              <span
                class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                :class="lead.status === 'new' ? 'bg-lime-200 text-emerald-950' : 'bg-slate-100 text-slate-600'"
              >
                {{ lead.status || 'new' }}
              </span>
              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                {{ lead.source || 'website_contact' }}
              </span>
            </div>
            <p class="mt-2 text-sm text-slate-600">
              <a v-if="lead.phone" :href="`tel:${lead.phone}`" class="font-semibold text-emerald-800 hover:underline">{{ lead.phone }}</a>
              <span v-else-if="lead.email">{{ lead.email }}</span>
              <span v-if="lead.address"> · {{ lead.address }}</span>
            </p>
            <p v-if="lead.message" class="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-700">{{ lead.message }}</p>
            <p class="mt-3 text-xs text-slate-400">
              {{ attributionLine(lead) }}
              <span v-if="lead.landing_page"> · landed on {{ lead.landing_page }}</span>
            </p>
            <p class="mt-1 text-xs text-slate-400">
              {{ lead.created_at ? new Date(lead.created_at).toLocaleString() : '' }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
              @click="markStatus(lead, 'contacted')"
            >
              Mark contacted
            </button>
            <button
              type="button"
              class="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              @click="markStatus(lead, 'site_visit')"
            >
              Site visit
            </button>
            <button
              type="button"
              class="rounded-full bg-lime-100 px-4 py-2 text-sm font-bold text-emerald-950 transition hover:bg-lime-200"
              @click="markStatus(lead, 'won')"
            >
              Won
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
              @click="deleteLead(lead)"
            >
              <Trash2 class="h-4 w-4" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>

    <p v-if="!isSupabaseConfigured" class="mt-6 text-sm text-slate-500">Connect Supabase to enable lead storage.</p>
  </div>
</template>
