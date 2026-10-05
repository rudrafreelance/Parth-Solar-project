<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Phone } from '@lucide/vue'
import { installationFaqs } from '@/data/localSeo'
import { ADMIN_PHONE_DISPLAY, ADMIN_TEL_HREF, openWhatsApp } from '@/lib/contact'
import { submitLead } from '@/lib/submitLead'

const router = useRouter()

const steps = [
  {
    title: 'Free roof survey',
    text: 'We visit your Ahmedabad site, check usable roof, shade, and the electricity connection before suggesting a system size.',
  },
  {
    title: 'Size from your bill',
    text: 'Monthly units decide a 3 kW, 5 kW, or larger plant. The quote shows expected savings and payback before you commit.',
  },
  {
    title: 'Structure, panels, and inverter',
    text: 'The crew fits the mounting structure, modules, inverter, cabling, and earthing. Most home installs finish in one to three days.',
  },
  {
    title: 'Net metering and subsidy',
    text: 'We help with the DISCOM net-metering file and, for eligible Gujarat homes, the PM Surya Ghar subsidy checklist.',
  },
]

const included = [
  'Site survey and layout for your roof',
  'Mounting structure, panels, inverter, and cabling',
  'Earthing, testing, and commissioning',
  'Net-metering coordination',
  'PM Surya Ghar document help for eligible homes',
  'A project contact through handover',
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
      message: form.bill ? `Monthly bill: ${form.bill}` : 'Solar installation Ahmedabad enquiry',
      sourceFallback: 'solar_installation_ahmedabad',
    })
    await router.push({ name: 'thank-you', query: { from: 'solar-installation' } })
  } catch (err) {
    status.value = err.message || 'Something went wrong. Please call 63558 59771.'
  } finally {
    submitting.value = false
  }
}

function askOnWhatsApp() {
  openWhatsApp('Hi Ideal Energy — I want solar installation in Ahmedabad. Please share a survey slot.')
}
</script>

<template>
  <main>
    <section class="bg-[#071c16] px-5 pb-16 pt-32 text-white sm:px-8 sm:pt-36 lg:px-12 lg:pb-20">
      <div class="mx-auto max-w-3xl">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">Ahmedabad rooftop solar</p>
        <h1 class="mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-6xl">
          Solar installation in Ahmedabad
        </h1>
        <p class="mt-6 text-lg leading-8 text-emerald-50/75">
          Ideal Energy handles solar installation in Ahmedabad for homes, shops, and factories. The same team surveys the roof, installs the system, and helps with net metering and the PM Surya Ghar subsidy.
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
            WhatsApp for a survey
          </button>
        </div>
      </div>
    </section>

    <section class="bg-[#f3f6ef] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <div>
          <h2 class="text-3xl font-bold tracking-[-0.03em] text-emerald-950 sm:text-4xl">
            How installation works
          </h2>
          <p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            A solar installation in Ahmedabad starts with the roof and the electricity bill, not a fixed package. You see the system size and the next step before work begins.
          </p>
          <ol class="mt-8 space-y-5">
            <li v-for="(step, index) in steps" :key="step.title">
              <h3 class="text-lg font-bold text-emerald-950">{{ index + 1 }}. {{ step.title }}</h3>
              <p class="mt-1 leading-7 text-slate-600">{{ step.text }}</p>
            </li>
          </ol>

          <h2 class="mt-12 text-2xl font-bold text-emerald-950">What the installation includes</h2>
          <ul class="mt-4 space-y-2">
            <li v-for="item in included" :key="item" class="leading-7 text-slate-600">{{ item }}</li>
          </ul>

          <p class="mt-8 leading-7 text-slate-600">
            Compare
            <RouterLink to="/solar-panel-price-ahmedabad" class="font-bold text-emerald-800 underline-offset-4 hover:underline">
              solar panel price in Ahmedabad
            </RouterLink>
            , see
            <RouterLink to="/services/residential" class="font-bold text-emerald-800 underline-offset-4 hover:underline">
              home solar
            </RouterLink>
            or
            <RouterLink to="/services/commercial" class="font-bold text-emerald-800 underline-offset-4 hover:underline">
              commercial solar
            </RouterLink>
            , and check
            <RouterLink to="/services/government-subsidy" class="font-bold text-emerald-800 underline-offset-4 hover:underline">
              subsidy support
            </RouterLink>
            . Recent work is on the
            <RouterLink to="/projects" class="font-bold text-emerald-800 underline-offset-4 hover:underline">
              projects
            </RouterLink>
            page.
          </p>

          <h2 class="mt-12 text-2xl font-bold text-emerald-950">Areas we install in</h2>
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
          <h2 class="text-2xl font-bold tracking-[-0.03em] text-emerald-950">Book a free survey</h2>
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
            {{ submitting ? 'Sending…' : 'Request installation survey' }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </button>
          <p v-if="status" class="mt-4 text-sm font-semibold text-red-700">{{ status }}</p>
        </form>
      </div>
    </section>

    <section class="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-3xl font-bold tracking-[-0.03em] text-emerald-950">Questions about solar installation in Ahmedabad</h2>
        <div class="mt-8 divide-y divide-emerald-950/10 border-y border-emerald-950/10">
          <article v-for="faq in installationFaqs" :key="faq.question" class="py-6">
            <h3 class="text-lg font-bold text-emerald-950">{{ faq.question }}</h3>
            <p class="mt-2 leading-7 text-slate-600">{{ faq.answer }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
