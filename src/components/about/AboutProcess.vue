<script setup>
import { ClipboardCheck, Headphones, MapPinned, PenTool, Power, Wrench } from '@lucide/vue'
import SectionHeading from './SectionHeading.vue'

const steps = [
  { icon: ClipboardCheck, title: 'Consultation', text: 'We understand your goals, usage, and budget.' },
  { icon: MapPinned, title: 'Site survey', text: 'Our team evaluates your property and solar potential.' },
  { icon: PenTool, title: 'System design', text: 'Engineers create a right-sized, high-output solution.' },
  { icon: Wrench, title: 'Installation', text: 'Certified crews install cleanly, safely, and efficiently.' },
  { icon: Power, title: 'Testing', text: 'Every component is verified before activation.' },
  { icon: Headphones, title: 'Ongoing support', text: 'Monitoring and real people keep performance on track.' },
]
</script>

<template>
  <section class="overflow-hidden bg-[#071c16] py-20 text-white sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Our process"
        title="A clear path from idea to impact."
        description="One experienced team manages every stage, keeping your project simple, transparent, and on schedule."
        dark
      />
      <div class="relative mt-16">
        <div class="absolute left-[8.33%] right-[8.33%] top-8 hidden border-t border-dashed border-lime-300/25 lg:block" aria-hidden="true"></div>
        <ol class="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          <li
            v-for="(step, index) in steps"
            :key="step.title"
            data-aos="fade-up"
            :data-aos-delay="index * 80"
            class="relative flex gap-5 text-left lg:block lg:text-center"
          >
            <div class="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-[#071c16] bg-lime-300 text-emerald-950 shadow-lg shadow-black/20 lg:mx-auto">
              <component :is="step.icon" class="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-lime-300 lg:mt-7">Step {{ index + 1 }}</p>
              <h3 class="mt-2 text-lg font-bold text-white">{{ step.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-emerald-50/55">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
