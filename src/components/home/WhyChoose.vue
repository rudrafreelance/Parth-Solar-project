<script setup>
import { BatteryCharging, CircleDollarSign, Headphones, LineChart, Recycle, Wrench } from '@lucide/vue'

const reasons = [
  { icon: LineChart, title: 'Higher lifetime output', text: 'Smart layouts and tier-one panels deliver more energy from every available ray.' },
  { icon: CircleDollarSign, title: 'Savings that add up', text: 'Transparent projections help you understand your payback before you commit.' },
  { icon: BatteryCharging, title: 'Ready for what is next', text: 'Flexible systems make adding batteries and EV charging straightforward.' },
  { icon: Wrench, title: 'Installed with care', text: 'Our in-house crews protect your property and never cut corners.' },
  { icon: Headphones, title: 'Support that stays', text: 'Real people monitor your system and remain available long after switch-on.' },
  { icon: Recycle, title: 'Lighter impact', text: 'Responsible sourcing and recycling keep your clean-energy choice truly cleaner.' },
]
</script>

<template>
  <section class="bg-[#f3f6ef] py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div class="mx-auto max-w-3xl text-center">
        <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Why choose us</p>
        <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-emerald-950 sm:text-5xl">
          Solar made simple. Quality made to last.
        </h2>
        <p data-aos="fade-up" data-aos-delay="160" class="mt-5 text-lg leading-8 text-slate-600">
          Every detail is considered, from your first energy review to decades of dependable production.
        </p>
      </div>

      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        <article
          v-for="(reason, index) in reasons"
          :key="reason.title"
          data-aos="fade-up"
          :data-aos-delay="(index % 3) * 100"
          class="group rounded-3xl border border-emerald-950/10 bg-white p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-600/30 hover:shadow-xl hover:shadow-emerald-950/5 sm:p-8"
        >
          <div class="grid h-13 w-13 place-items-center rounded-2xl bg-lime-200 text-emerald-950 transition group-hover:bg-emerald-950 group-hover:text-lime-300">
            <component :is="reason.icon" class="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 class="mt-6 text-xl font-bold text-emerald-950">{{ reason.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ reason.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
