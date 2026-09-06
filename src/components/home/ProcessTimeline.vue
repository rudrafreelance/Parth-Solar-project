<script setup>
import { ClipboardCheck, FileCheck2, Power, Ruler, Wrench } from '@lucide/vue'

const steps = [
  { icon: ClipboardCheck, title: 'Energy review', text: 'We learn how you use energy and what you want solar to achieve.' },
  { icon: Ruler, title: 'Custom design', text: 'Our engineers map a high-performing system for your exact property.' },
  { icon: FileCheck2, title: 'Permits & approvals', text: 'We handle utility paperwork, local permits, and incentive details.' },
  { icon: Wrench, title: 'Expert installation', text: 'Our certified crew installs safely, neatly, and with minimal disruption.' },
  { icon: Power, title: 'Switch on & save', text: 'We activate, monitor, and show you how to get the most from your system.' },
]
</script>

<template>
  <section id="process" class="overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div class="mx-auto max-w-3xl text-center">
        <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">How it works</p>
        <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-emerald-950 sm:text-5xl">
          From first call to clean power.
        </h2>
        <p data-aos="fade-up" data-aos-delay="160" class="mt-5 text-lg leading-8 text-slate-600">
          A proven five-step process keeps your project clear, efficient, and moving forward.
        </p>
      </div>

      <ol class="relative mt-16 grid gap-8 lg:grid-cols-5 lg:gap-5">
        <div class="absolute left-[10%] right-[10%] top-8 hidden border-t border-dashed border-emerald-900/25 lg:block"></div>
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
          class="relative flex gap-5 text-left lg:block lg:text-center"
        >
          <div class="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-white bg-emerald-950 text-lime-300 shadow-lg shadow-emerald-950/10 lg:mx-auto">
            <component :is="step.icon" class="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 lg:mt-7">Step {{ index + 1 }}</p>
            <h3 class="mt-2 text-xl font-bold text-emerald-950">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600">{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
