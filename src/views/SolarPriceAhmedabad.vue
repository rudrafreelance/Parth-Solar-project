<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Phone } from '@lucide/vue'
import { priceFaqs } from '@/data/localSeo'
import { ADMIN_PHONE_DISPLAY, ADMIN_TEL_HREF, openWhatsApp } from '@/lib/contact'
import { submitLead } from '@/lib/submitLead'

const router = useRouter()
const factors = [
  {
    title: 'Your electricity bill',
    text: 'Monthly units decide whether a 3 kW, 5 kW, or larger rooftop system is the right size. A bigger plant is not always the better quote.',
  },
  {
    title: 'Roof and shadow',
    text: 'Usable area, direction, and shade in Ahmedabad change how many panels fit and how much they produce.',
  },
  {
    title: 'On-grid or battery',
    text: 'A grid-tied system costs less. A battery adds backup for power cuts and raises the quote.',
  },
  {
    title: 'PM Surya Ghar subsidy',
    text: 'Eligible Gujarat homes can lower the amount you pay. We check eligibility and help with the paperwork.',
  },
]

const areas = ['Ahmedabad', 'Gandhinagar', 'Sanand', 'Naroda', 'Nikol', 'Bopal', 'Gota']

const form = reactive({
  firstName: '',
  phone: '',
  address: '',
  bill: '',
})
const submitting = ref(false)
const status = ref('')
const phoneDigits = computed(() => form.phone.replace(/\D/g, '').slice(0, 10))

function onPhoneInput(event) {
  form.phone = event.target.value.replace(/\D/g, '').slice(0, 10)
}

async function onSubmit() {
  submitting.value = true
  status.value = ''
  try {
    if (!/^[6-9]\d{9}$/.test(phoneDigits.value)) {
      status.value = 'Enter a valid 10-digit mobile number starting with 6–9.'
      return
    }
    await submitLead({
      firstName: form.firstName,
      phone: `+91${phoneDigits.value}`,
      address: form.address,
      message: form.bill ? `Monthly bill: ${form.bill}` : 'Solar panel price quote request',
      sourceFallback: 'solar_price_ahmedabad',
    })
    await router.push({ name: 'thank-you', query: { from: 'solar-price' } })
  } catch (err) {
    status.value = err.message || 'Something went wrong. Please call 63558 59771.'
  } finally {
    submitting.value = false
  }
}

function askOnWhatsApp() {
  openWhatsApp('Hi Ideal Energy — I want a solar panel price quote for my site in Ahmedabad.')
}
</script>

<template>
  <main>
    <section class="bg-[#071c16] px-5 pb-16 pt-32 text-white sm:px-8 sm:pt-36 lg:px-12 lg:pb-20">
      <div class="mx-auto max-w-3xl">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">Ahmedabad rooftop solar</p>
        <h1 class="mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-6xl">
          Solar panel price in Ahmedabad
        </h1>
        <p class="mt-6 text-lg leading-8 text-emerald-50/75">
          Ideal Energy quotes home and commercial rooftop solar after a free site survey. You get the system size, expected savings, and payback before you commit — including PM Surya Ghar subsidy help for eligible Gujarat homes.
        </p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            :href="ADMIN_TEL_HREF"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3.5 font-bold text-emerald-950 transition hover:bg-lime-200"
          >
            <Phone class="h-4 w-4" aria-hidden="true" />
            Call {{ ADMIN_PHONE_DISPLAY }}
          </a>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
            @click="askOnWhatsApp"
          >
            WhatsApp a quote
          </button>
        </div>
      </div>
    </section>

    <section class="bg-[#f3f6ef] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <div>
          <h2 class="text-3xl font-bold tracking-[-0.03em] text-emerald-950 sm:text-4xl">
            What changes the price
          </h2>
          <p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            A fixed “per panel” rate hides the things that actually move an Ahmedabad quote. We price the plant that fits your roof and bill.
          </p>
          <ul class="mt-8 space-y-5">
            <li v-for="factor in factors" :key="factor.title">
              <h3 class="text-lg font-bold text-emerald-950">{{ factor.title }}</h3>
              <p class="mt-1 leading-7 text-slate-600">{{ factor.text }}</p>
            </li>
          </ul>
          <p class="mt-8 leading-7 text-slate-600">
            Want a savings estimate first?
            <RouterLink to="/calculator" class="font-bold text-emerald-800 underline-offset-4 hover:underline">
              Use the solar calculator
            </RouterLink>
            or see
            <RouterLink to="/services/residential" class="font-bold text-emerald-800 underline-offset-4 hover:underline">
              residential installation
            </RouterLink>
            and
            <RouterLink to="/services/government-subsidy" class="font-bold text-emerald-800 underline-offset-4 hover:underline">
              subsidy support
            </RouterLink>.
          </p>
          <h2 class="mt-12 text-2xl font-bold text-emerald-950">Areas we survey</h2>
          <ul class="mt-4 flex flex-wrap gap-2">
            <li
              v-for="area in areas"
              :key="area"
              class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-950"
            >
              {{ area }}
            </li>
          </ul>
        </div>

        <form class="rounded-3xl bg-white p-6 shadow-sm sm:p-8" @submit.prevent="onSubmit">
          <h2 class="text-2xl font-bold tracking-[-0.03em] text-emerald-950">Get a clear quote</h2>
          <p class="mt-2 leading-7 text-slate-600">Share your name, mobile, and area. An advisor calls within one business day.</p>
          <div class="mt-6 space-y-4">
            <label class="block text-sm font-semibold text-emerald-950">
              Name
              <input
                v-model="form.firstName"
                required
                name="name"
                autocomplete="name"
                class="mt-2 w-full rounded-2xl border border-emerald-950/15 px-4 py-3 outline-none focus:border-emerald-700"
              />
            </label>
            <label class="block text-sm font-semibold text-emerald-950">
              Mobile
              <input
                :value="form.phone"
                required
                name="phone"
                inputmode="numeric"
                autocomplete="tel"
                maxlength="10"
                placeholder="10-digit mobile"
                class="mt-2 w-full rounded-2xl border border-emerald-950/15 px-4 py-3 outline-none focus:border-emerald-700"
                @input="onPhoneInput"
              />
            </label>
            <label class="block text-sm font-semibold text-emerald-950">
              Area
              <input
                v-model="form.address"
                required
                name="area"
                placeholder="Bopal, Nikol, Gandhinagar…"
                class="mt-2 w-full rounded-2xl border border-emerald-950/15 px-4 py-3 outline-none focus:border-emerald-700"
              />
            </label>
            <label class="block text-sm font-semibold text-emerald-950">
              Monthly electricity bill
              <input
                v-model="form.bill"
                name="bill"
                placeholder="Optional, for example ₹4,000"
                class="mt-2 w-full rounded-2xl border border-emerald-950/15 px-4 py-3 outline-none focus:border-emerald-700"
              />
            </label>
          </div>
          <button
            type="submit"
            class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            :disabled="submitting"
          >
            {{ submitting ? 'Sending…' : 'Request my quote' }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </button>
          <p v-if="status" class="mt-4 text-sm font-semibold text-red-700">{{ status }}</p>
        </form>
      </div>
    </section>

    <section class="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-3xl font-bold tracking-[-0.03em] text-emerald-950">Questions about Ahmedabad solar prices</h2>
        <div class="mt-8 divide-y divide-emerald-950/10 border-y border-emerald-950/10">
          <article v-for="faq in priceFaqs" :key="faq.question" class="py-6">
            <h3 class="text-lg font-bold text-emerald-950">{{ faq.question }}</h3>
            <p class="mt-2 leading-7 text-slate-600">{{ faq.answer }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
