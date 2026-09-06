<script setup>
import { Check } from '@lucide/vue'
import ServicesHeading from './ServicesHeading.vue'

const plans = [
  { name: 'Residential', price: '$8,900', note: 'Typical 5 kW system', features: ['Custom system design', 'Premium solar panels', 'Smart inverter', 'App monitoring', 'Permit support'], recommended: false },
  { name: 'Commercial', price: '$34,500', note: 'Typical 25 kW system', features: ['Detailed energy audit', 'Commercial-grade equipment', 'Performance reporting', 'Flexible financing', 'Priority support'], recommended: true },
  { name: 'Industrial', price: 'Custom', note: 'Engineered for your facility', features: ['Feasibility study', 'HT/LT integration', 'SCADA monitoring', 'Phased deployment', 'Dedicated project lead'], recommended: false },
]
</script>

<template>
  <section class="bg-[#f3f6ef] py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <ServicesHeading
        eyebrow="Transparent starting points"
        title="A plan for every scale."
        description="Every property is different. These guide prices help you start the conversation; your proposal is tailored after a site review."
      />
      <div class="mt-14 grid items-stretch gap-6 lg:mt-16 lg:grid-cols-3">
        <article
          v-for="(plan, index) in plans"
          :key="plan.name"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
          class="relative flex flex-col rounded-[2rem] border p-7 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9"
          :class="plan.recommended ? 'border-emerald-950 bg-emerald-950 text-white shadow-xl shadow-emerald-950/15 lg:-translate-y-3 lg:hover:-translate-y-4' : 'border-emerald-950/10 bg-white text-emerald-950'"
        >
          <span v-if="plan.recommended" class="absolute right-6 top-6 rounded-full bg-lime-300 px-3 py-1.5 text-xs font-bold text-emerald-950">Recommended</span>
          <p class="text-sm font-bold uppercase tracking-[0.16em]" :class="plan.recommended ? 'text-lime-300' : 'text-emerald-600'">{{ plan.name }}</p>
          <p class="mt-7 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{{ plan.price }}</p>
          <p class="mt-2 text-sm" :class="plan.recommended ? 'text-emerald-50/55' : 'text-slate-500'">{{ plan.note }}</p>
          <ul class="mt-8 flex-1 space-y-4 border-t pt-7" :class="plan.recommended ? 'border-white/10' : 'border-emerald-950/10'">
            <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-sm font-semibold">
              <span class="grid h-5 w-5 place-items-center rounded-full bg-lime-300 text-emerald-950"><Check class="h-3 w-3" stroke-width="3" aria-hidden="true" /></span>
              {{ feature }}
            </li>
          </ul>
          <a href="#contact" class="mt-9 inline-flex justify-center rounded-full px-6 py-3.5 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2" :class="plan.recommended ? 'bg-lime-300 text-emerald-950 hover:bg-lime-200 focus-visible:outline-lime-300' : 'bg-emerald-950 text-white hover:bg-emerald-800 focus-visible:outline-emerald-600'">
            Get a tailored quote
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
