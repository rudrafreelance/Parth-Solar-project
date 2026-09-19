<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Clock3, Mail, MapPin, Phone } from '@lucide/vue'
import { submitLead } from '@/lib/submitLead'

const router = useRouter()

const contactDetails = [
  { icon: Phone, label: 'Call us', value: '63558 59771', href: 'tel:+916355859771' },
  { icon: Mail, label: 'Email us', value: 'idealeneergy@gmail.com', href: 'mailto:idealeneergy@gmail.com' },
  { icon: MapPin, label: 'Visit us', value: 'Ahmedabad, Gujarat, India', href: null },
  { icon: Clock3, label: 'Office hours', value: 'Mon–Sat, 9:00 AM–7:00 PM', href: null },
]

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  interest: '',
  address: '',
  message: '',
})

const submitting = ref(false)
const status = ref('')
const statusType = ref('info')

const phoneDigits = computed(() => form.phone.replace(/\D/g, '').slice(0, 10))

function onPhoneInput(event) {
  form.phone = event.target.value.replace(/\D/g, '').slice(0, 10)
}

function isValidIndianPhone(value) {
  return /^[6-9]\d{9}$/.test(value)
}

async function onSubmit() {
  submitting.value = true
  status.value = ''

  try {
    if (!isValidIndianPhone(phoneDigits.value)) {
      statusType.value = 'error'
      status.value = 'Please enter a valid 10-digit Indian mobile number (starting with 6–9).'
      return
    }

    await submitLead({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: `+91${phoneDigits.value}`,
      interest: form.interest,
      address: form.address,
      message: form.message,
      sourceFallback: 'website_contact',
    })

    await router.push({ name: 'thank-you', query: { from: 'contact' } })
  } catch (err) {
    statusType.value = 'error'
    status.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section id="contact" class="bg-[#071c16] py-20 text-white sm:py-24 lg:py-32">
    <div class="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-12">
      <div class="text-left">
        <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">Let’s talk solar</p>
        <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-5xl">
          Tell us where your energy journey begins.
        </h2>
        <p data-aos="fade-up" data-aos-delay="160" class="mt-6 text-lg leading-8 text-emerald-50/65">
          Share a few details and an energy advisor will contact you within one business day.
        </p>
        <RouterLink
          data-aos="fade-up"
          data-aos-delay="200"
          to="/calculator"
          class="mt-6 inline-flex text-sm font-bold text-lime-300 underline-offset-4 transition hover:underline"
        >
          Or estimate your savings with our calculator →
        </RouterLink>

        <address data-aos="fade-up" data-aos-delay="240" class="mt-10 grid gap-6 not-italic sm:grid-cols-2 lg:grid-cols-1">
          <div v-for="detail in contactDetails" :key="detail.label" class="flex items-center gap-4">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-lime-300">
              <component :is="detail.icon" class="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span class="block text-xs font-bold uppercase tracking-wider text-emerald-50/45">{{ detail.label }}</span>
              <a v-if="detail.href" :href="detail.href" class="mt-1 block font-semibold text-white transition hover:text-lime-300">{{ detail.value }}</a>
              <span v-else class="mt-1 block font-semibold text-white">{{ detail.value }}</span>
            </span>
          </div>
        </address>
      </div>

      <form data-aos="fade-left" class="rounded-[2rem] bg-white p-6 text-left shadow-2xl sm:p-9" @submit.prevent="onSubmit">
        <div class="grid gap-5 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm font-bold text-emerald-950">First name</span>
            <input
              v-model="form.firstName"
              type="text"
              name="firstName"
              autocomplete="given-name"
              required
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="Rahul"
            />
          </label>
          <label class="block">
            <span class="text-sm font-bold text-emerald-950">Last name</span>
            <input
              v-model="form.lastName"
              type="text"
              name="lastName"
              autocomplete="family-name"
              required
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="Sharma"
            />
          </label>
          <label class="block sm:col-span-2">
            <span class="text-sm font-bold text-emerald-950">Phone number</span>
            <div class="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10">
              <span class="grid place-items-center border-r border-slate-200 bg-white px-4 text-sm font-bold text-emerald-950">+91</span>
              <input
                :value="form.phone"
                type="tel"
                name="phone"
                inputmode="numeric"
                autocomplete="tel-national"
                required
                maxlength="10"
                minlength="10"
                title="Enter exactly 10 digits"
                class="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-emerald-950 outline-none placeholder:text-slate-400"
                placeholder="9876543210"
                @input="onPhoneInput"
              />
            </div>
            <span class="mt-2 block text-xs text-slate-500">Exactly 10 digits. Example: 9876543210</span>
          </label>
          <label class="block sm:col-span-2">
            <span class="text-sm font-bold text-emerald-950">Interested in</span>
            <select
              v-model="form.interest"
              name="interest"
              required
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            >
              <option value="" disabled>Select type of installation</option>
              <option value="residential">🏠 Residential — Home rooftop solar</option>
              <option value="commercial">🏢 Commercial — Offices, shops, factories</option>
              <option value="industrial">🏭 Industrial — Large-scale systems</option>
              <option value="agricultural">🌾 Agricultural — Solar pumps for farming</option>
              <option value="battery_storage">🔋 Battery Storage — Energy backup</option>
            </select>
          </label>
          <label class="block sm:col-span-2">
            <span class="text-sm font-bold text-emerald-950">Property address / PIN code</span>
            <input
              v-model="form.address"
              type="text"
              name="address"
              autocomplete="street-address"
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="City, area, or PIN code"
            />
          </label>
          <label class="block sm:col-span-2">
            <span class="text-sm font-bold text-emerald-950">How can we help?</span>
            <textarea
              v-model="form.message"
              name="message"
              rows="4"
              class="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="Tell us about your energy goals..."
            ></textarea>
          </label>
        </div>

        <p
          v-if="status"
          class="mt-5 rounded-xl px-4 py-3 text-sm font-medium"
          :class="statusType === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'"
        >
          {{ status }}
        </p>

        <button
          type="submit"
          class="mt-6 w-full rounded-full bg-emerald-950 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Sending…' : 'Request my free solar plan' }}
        </button>
        <p class="mt-4 text-center text-xs leading-5 text-slate-500">
          By submitting, you agree to be contacted about your solar project on this number.
        </p>
      </form>
    </div>
  </section>
</template>
