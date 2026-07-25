<script setup>
import { ArrowUpRight, CheckCircle2 } from '@lucide/vue'
import SectionHeading from './SectionHeading.vue'

const milestones = [
  { year: '2011', label: 'Founded with a simple clean-energy mission' },
  { year: '2016', label: 'Expanded into commercial solar engineering' },
  { year: '2021', label: 'Introduced intelligent battery solutions' },
  { year: 'Today', label: 'Powering thousands of homes and businesses' },
]
</script>

<template>
  <section class="overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
    <div class="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
      <div data-aos="fade-right" class="relative">
        <img
          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=85"
          alt="Solar engineering team reviewing a renewable energy project"
          class="aspect-[4/5] w-full rounded-[2rem] object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute -bottom-6 right-3 rounded-3xl bg-lime-300 p-6 text-emerald-950 shadow-xl sm:right-8">
          <p class="text-4xl font-bold tracking-tight">15+</p>
          <p class="mt-1 text-sm font-bold">years of solar expertise</p>
        </div>
      </div>

      <div>
        <SectionHeading
          eyebrow="Our story"
          title="Purpose-led from the very first panel."
          description="Solara began with the belief that choosing clean energy should feel clear, confident, and personal. That principle still guides every system we design."
          align="left"
        />
        <p data-aos="fade-up" data-aos-delay="220" class="mt-6 text-left leading-7 text-slate-600">
          Today, our in-house engineers, project managers, and certified installers work as one team—turning complex energy decisions into reliable systems built for decades of performance.
        </p>

        <ol data-aos="fade-up" data-aos-delay="280" class="mt-9 grid gap-4 sm:grid-cols-2">
          <li v-for="milestone in milestones" :key="milestone.year" class="flex gap-3 rounded-2xl bg-[#f3f6ef] p-4 text-left">
            <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <p class="text-sm font-bold text-emerald-950">{{ milestone.year }}</p>
              <p class="mt-1 text-sm leading-5 text-slate-600">{{ milestone.label }}</p>
            </div>
          </li>
        </ol>

        <a data-aos="fade-up" data-aos-delay="340" href="#contact" class="mt-9 inline-flex items-center gap-2 rounded-full bg-emerald-950 px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
          Start your solar story
          <ArrowUpRight class="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
</template>
