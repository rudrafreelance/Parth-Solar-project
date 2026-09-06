<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Calculator, Leaf, IndianRupee, Sun } from '@lucide/vue'
import { BILL_PERIODS, estimateSolarSavings, formatInr } from '@/lib/solarEstimate'
import { openWhatsApp } from '@/lib/contact'
import { notifyCalculatorEstimate, submitLead } from '@/lib/submitLead'

const router = useRouter()

const inputs = reactive({
  billAmount: 7000,
  billPeriodMonths: 2,
  propertyType: 'residential',
})

const lead = reactive({
  firstName: '',
  phone: '',
})

const submitting = ref(false)
const status = ref('')
const statusType = ref('info')
const estimated = ref(false)
const highlightPanel = ref(false)
const resultsPanel = ref(null)
const leadCapture = ref(null)
const nameInput = ref(null)

const estimate = computed(() =>
  estimateSolarSavings({
    billAmount: inputs.billAmount,
    billPeriodMonths: inputs.billPeriodMonths,
    propertyType: inputs.propertyType,
  }),
)

const billLabel = computed(() =>
  inputs.billPeriodMonths === 2 ? 'Average 2-month electricity bill (₹)' : 'Average monthly electricity bill (₹)',
)

const rangeMax = computed(() => (inputs.billPeriodMonths === 2 ? 50000 : 25000))

const highlights = computed(() => [
  {
    icon: Sun,
    label: 'Suggested system',
    value: `${estimate.value.systemKw} kW`,
  },
  {
    icon: IndianRupee,
    label: 'Est. monthly savings',
    value: formatInr(estimate.value.monthlySavings),
  },
  {
    icon: Leaf,
    label: 'Payback (after subsidy*)',
    value: estimate.value.paybackYears ? `${estimate.value.paybackYears} yrs` : '—',
  },
])

function onPhoneInput(event) {
  lead.phone = event.target.value.replace(/\D/g, '').slice(0, 10)
}

function isValidIndianPhone(value) {
  return /^[6-9]\d{9}$/.test(value)
}

async function showEstimate() {
  try {
    // Clamp empty / invalid bill so HTML5 validation never blocks the action
    const amount = Number(inputs.billAmount)
    inputs.billAmount = Number.isFinite(amount) && amount > 0 ? amount : 7000

    estimated.value = true
    status.value = ''
    highlightPanel.value = true

    const e = estimate.value
    const waMessage = [
      'Hi Ideal Energy — I checked the solar calculator',
      `Bill: ${formatInr(e.billAmount)} (${e.billPeriodLabel})`,
      `≈ ${formatInr(e.monthlyBill)}/month`,
      `Property: ${e.propertyType}`,
      `Suggested system: ${e.systemKw} kW`,
      `Est. subsidy*: ${formatInr(e.subsidy)}`,
      `Est. net investment: ${formatInr(e.netCost)}`,
      `Est. yearly savings: ${formatInr(e.annualSavings)}`,
      `Est. payback: ${e.paybackYears ?? '—'} years`,
      '',
      'Please share a free solar plan.',
    ].join('\n')

    openWhatsApp(waMessage)

    notifyCalculatorEstimate({
      billAmount: e.billAmount,
      billPeriodMonths: e.billPeriodMonths,
      billPeriodLabel: e.billPeriodLabel,
      monthlyBill: e.monthlyBill,
      propertyType: e.propertyType,
      systemKw: e.systemKw,
      monthlySavings: e.monthlySavings,
      netCost: e.netCost,
      paybackYears: e.paybackYears,
    }).catch(() => {})

    await nextTick()
    leadCapture.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => nameInput.value?.focus(), 400)

    window.setTimeout(() => {
      highlightPanel.value = false
    }, 1200)
  } catch (err) {
    console.error('showEstimate failed', err)
    estimated.value = true
  }
}

async function requestFullPlan() {
  submitting.value = true
  status.value = ''

  try {
    if (!lead.firstName.trim()) {
      statusType.value = 'error'
      status.value = 'Please enter your name.'
      return
    }
    if (!isValidIndianPhone(lead.phone)) {
      statusType.value = 'error'
      status.value = 'Please enter a valid 10-digit Indian mobile number (starting with 6–9).'
      return
    }

    const e = estimate.value
    const message = [
      'Solar calculator enquiry',
      `Bill entered: ${formatInr(e.billAmount)} (${e.billPeriodLabel})`,
      `Equivalent monthly: ${formatInr(e.monthlyBill)}`,
      `Property: ${e.propertyType}`,
      `Suggested size: ${e.systemKw} kW`,
      `Est. net cost: ${formatInr(e.netCost)} (subsidy* ${formatInr(e.subsidy)})`,
      `Est. annual savings: ${formatInr(e.annualSavings)}`,
      `Est. payback: ${e.paybackYears ?? '—'} years`,
    ].join('\n')

    await submitLead({
      firstName: lead.firstName,
      lastName: '',
      phone: `+91${lead.phone}`,
      address: '',
      message,
      sourceFallback: 'solar_calculator',
    })

    await router.push({ name: 'thank-you', query: { from: 'calculator' } })
  } catch (err) {
    statusType.value = 'error'
    status.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12 lg:py-20">
    <section class="text-left" data-aos="fade-up">
      <p class="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
        <Calculator class="h-4 w-4" aria-hidden="true" />
        Solar savings calculator
      </p>
      <h1 class="mt-4 text-4xl font-bold tracking-[-0.04em] text-emerald-950 sm:text-5xl">
        See what sunlight could save you each month.
      </h1>
      <p class="mt-5 max-w-xl text-lg leading-8 text-slate-600">
        Enter the amount on your electricity bill — monthly or 2-month (common in Gujarat) — for a quick Ideal Energy estimate.
      </p>

      <div class="mt-10 space-y-8 pb-28 sm:pb-10" data-aos="fade-up" data-aos-delay="100">
        <fieldset>
          <legend class="text-sm font-bold text-emerald-950">Your bill comes</legend>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label
              v-for="period in BILL_PERIODS"
              :key="period.months"
              class="flex cursor-pointer flex-col gap-1 rounded-2xl border px-4 py-4 transition"
              :class="Number(inputs.billPeriodMonths) === period.months ? 'border-emerald-700 bg-emerald-50' : 'border-slate-200 bg-white'"
            >
              <span class="flex items-center gap-3">
                <input
                  v-model.number="inputs.billPeriodMonths"
                  type="radio"
                  name="billPeriod"
                  :value="period.months"
                  class="accent-emerald-700"
                />
                <span class="font-semibold text-emerald-950">{{ period.label }}</span>
              </span>
              <span class="pl-7 text-xs leading-5 text-slate-500">{{ period.hint }}</span>
            </label>
          </div>
        </fieldset>

        <label class="block">
          <span class="text-sm font-bold text-emerald-950">{{ billLabel }}</span>
          <div class="mt-3 flex items-center gap-4">
            <input
              v-model.number="inputs.billAmount"
              type="range"
              min="1000"
              :max="rangeMax"
              step="100"
              class="h-2 w-full accent-emerald-700"
            />
            <span class="w-28 shrink-0 text-right text-lg font-bold text-emerald-950">
              {{ formatInr(inputs.billAmount || 0) }}
            </span>
          </div>
          <input
            v-model.number="inputs.billAmount"
            type="number"
            min="500"
            max="100000"
            step="100"
            inputmode="numeric"
            class="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-emerald-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
          />
          <span class="mt-2 block text-xs text-slate-500">
            We convert this to ~{{ formatInr(estimate.monthlyBill) }}/month for the estimate.
          </span>
        </label>

        <fieldset>
          <legend class="text-sm font-bold text-emerald-950">Property type</legend>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label
              class="flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 transition"
              :class="inputs.propertyType === 'residential' ? 'border-emerald-700 bg-emerald-50' : 'border-slate-200 bg-white'"
            >
              <input
                v-model="inputs.propertyType"
                type="radio"
                name="propertyType"
                value="residential"
                class="accent-emerald-700"
              />
              <span class="font-semibold text-emerald-950">Home / residential</span>
            </label>
            <label
              class="flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 transition"
              :class="inputs.propertyType === 'commercial' ? 'border-emerald-700 bg-emerald-50' : 'border-slate-200 bg-white'"
            >
              <input
                v-model="inputs.propertyType"
                type="radio"
                name="propertyType"
                value="commercial"
                class="accent-emerald-700"
              />
              <span class="font-semibold text-emerald-950">Shop / commercial</span>
            </label>
          </div>
        </fieldset>

        <button
          type="button"
          class="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 sm:w-auto"
          @click="showEstimate"
        >
          {{ estimated ? 'Update my estimate' : 'Get my estimate' }}
          <ArrowRight class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div
        v-if="estimated"
        id="calculator-results"
        ref="leadCapture"
        class="mt-10 scroll-mt-28 rounded-[1.75rem] border border-emerald-800/15 bg-white p-5 shadow-lg shadow-emerald-950/5 sm:p-7"
      >
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Your estimate is ready</p>
        <p class="mt-2 text-2xl font-bold text-emerald-950">
          {{ estimate.systemKw }} kW · save ~{{ formatInr(estimate.monthlySavings) }}/mo
        </p>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          From {{ formatInr(estimate.billAmount) }} bill ({{ estimate.billPeriodLabel }})
          ≈ {{ formatInr(estimate.monthlyBill) }}/mo · net ~{{ formatInr(estimate.netCost) }} after subsidy*
          · payback ~{{ estimate.paybackYears ?? '—' }} years
        </p>

        <form class="mt-6 space-y-4 border-t border-slate-100 pt-6" @submit.prevent="requestFullPlan">
          <p class="font-semibold text-emerald-950">Get this plan on a free call / WhatsApp</p>
          <label class="block">
            <span class="sr-only">Name</span>
            <input
              ref="nameInput"
              v-model="lead.firstName"
              type="text"
              required
              placeholder="Your name"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
          </label>
          <label class="block">
            <span class="sr-only">Phone</span>
            <div class="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10">
              <span class="grid place-items-center border-r border-slate-200 bg-white px-4 text-sm font-bold text-emerald-950">+91</span>
              <input
                :value="lead.phone"
                type="tel"
                inputmode="numeric"
                maxlength="10"
                required
                placeholder="9876543210"
                class="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-emerald-950 outline-none placeholder:text-slate-400"
                @input="onPhoneInput"
              />
            </div>
          </label>
          <p
            v-if="status"
            class="rounded-xl px-4 py-3 text-sm font-medium"
            :class="statusType === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'"
          >
            {{ status }}
          </p>
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-4 font-bold text-emerald-950 transition hover:bg-lime-200 disabled:opacity-60"
            :disabled="submitting"
          >
            {{ submitting ? 'Sending…' : 'Send my free solar plan' }}
          </button>
        </form>
      </div>
    </section>

    <aside
      ref="resultsPanel"
      class="scroll-mt-28 rounded-[2rem] bg-[#071c16] p-6 text-white transition ring-offset-4 sm:p-8"
      data-aos="fade-left"
      data-aos-delay="150"
      :class="highlightPanel ? 'ring-4 ring-lime-300' : 'ring-0'"
    >
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-lime-300">Your estimate</p>
      <p class="mt-3 text-2xl font-bold tracking-tight">
        {{ formatInr(estimate.billAmount) }}
        <span class="text-lg font-semibold text-emerald-50/70">({{ estimate.billPeriodLabel }})</span>
      </p>
      <p class="mt-2 text-sm text-emerald-50/65">
        Treated as {{ formatInr(estimate.monthlyBill) }}/month for sizing
      </p>

      <dl class="mt-8 grid gap-4">
        <div
          v-for="item in highlights"
          :key="item.label"
          class="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-4"
        >
          <span class="grid h-11 w-11 place-items-center rounded-xl bg-lime-300/15 text-lime-300">
            <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <dt class="text-xs font-bold uppercase tracking-wider text-emerald-50/50">{{ item.label }}</dt>
            <dd class="mt-1 text-xl font-bold">{{ item.value }}</dd>
          </div>
        </div>
      </dl>

      <ul class="mt-6 space-y-2 text-sm leading-6 text-emerald-50/70">
        <li>Est. system cost before subsidy: {{ formatInr(estimate.grossCost) }}</li>
        <li>Indicative subsidy*: {{ formatInr(estimate.subsidy) }}</li>
        <li>Est. net investment: {{ formatInr(estimate.netCost) }}</li>
        <li>25-year savings potential: {{ formatInr(estimate.twentyFiveYearSavings) }}</li>
      </ul>

      <p v-if="!estimated" class="mt-8 text-sm text-emerald-50/55">
        Choose monthly or 2-month bill, then tap <span class="text-white">Get my estimate</span>.
      </p>
      <p v-else class="mt-8 text-sm font-semibold text-lime-300">
        Estimate ready — enter your name & phone under the button to get a free plan.
      </p>

      <p class="mt-6 text-xs leading-5 text-emerald-50/40">
        *Indicative only. Final size, subsidy eligibility, and pricing depend on roof survey, DISCOM rules, and current schemes.
      </p>
    </aside>
  </div>
</template>
