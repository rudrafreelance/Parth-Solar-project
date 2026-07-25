<script setup>
import { Clock3, Mail, MapPin, Phone } from '@lucide/vue'

const contactDetails = [
  { icon: Phone, label: 'Call us', value: '(800) 555-SOLAR', href: 'tel:+18005557652' },
  { icon: Mail, label: 'Email us', value: 'hello@solara.energy', href: 'mailto:hello@solara.energy' },
  { icon: MapPin, label: 'Visit us', value: '240 Greenway Drive, Austin, TX', href: null },
  { icon: Clock3, label: 'Office hours', value: 'Mon–Fri, 8:00 AM–6:00 PM', href: null },
]
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

      <form data-aos="fade-left" class="rounded-[2rem] bg-white p-6 text-left shadow-2xl sm:p-9" @submit.prevent>
        <div class="grid gap-5 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm font-bold text-emerald-950">First name</span>
            <input
              type="text"
              name="firstName"
              autocomplete="given-name"
              required
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="Alex"
            />
          </label>
          <label class="block">
            <span class="text-sm font-bold text-emerald-950">Last name</span>
            <input
              type="text"
              name="lastName"
              autocomplete="family-name"
              required
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="Morgan"
            />
          </label>
          <label class="block sm:col-span-2">
            <span class="text-sm font-bold text-emerald-950">Email address</span>
            <input
              type="email"
              name="email"
              autocomplete="email"
              required
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="alex@example.com"
            />
          </label>
          <label class="block sm:col-span-2">
            <span class="text-sm font-bold text-emerald-950">Property address</span>
            <input
              type="text"
              name="address"
              autocomplete="street-address"
              class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="Where would you like to install solar?"
            />
          </label>
          <label class="block sm:col-span-2">
            <span class="text-sm font-bold text-emerald-950">How can we help?</span>
            <textarea
              name="message"
              rows="4"
              class="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              placeholder="Tell us about your energy goals..."
            ></textarea>
          </label>
        </div>
        <button type="submit" class="mt-6 w-full rounded-full bg-emerald-950 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20">
          Request my free solar plan
        </button>
        <p class="mt-4 text-center text-xs leading-5 text-slate-500">
          By submitting, you agree to be contacted about your solar project. No spam, ever.
        </p>
      </form>
    </div>
  </section>
</template>
