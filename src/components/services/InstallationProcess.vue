<script setup>
import { BadgeCheck, ClipboardList, FileCheck2, Headphones, MapPinned, Power, Wrench } from '@lucide/vue'
import ServicesHeading from './ServicesHeading.vue'

const steps = [
  { icon: ClipboardList, title: 'Consultation', text: 'Goals and energy use' },
  { icon: MapPinned, title: 'Site survey', text: 'Property assessment' },
  { icon: FileCheck2, title: 'Proposal', text: 'Design and savings' },
  { icon: BadgeCheck, title: 'Approval', text: 'Permits and utility' },
  { icon: Wrench, title: 'Installation', text: 'Safe expert delivery' },
  { icon: Power, title: 'Testing', text: 'Quality and activation' },
  { icon: Headphones, title: 'Maintenance', text: 'Monitoring and care' },
]
</script>

<template>
  <section class="overflow-hidden bg-[#071c16] py-20 text-white sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <ServicesHeading
        eyebrow="Installation process"
        title="Seven steps. One seamless experience."
        description="A clear, accountable process keeps every decision informed and every project moving."
        dark
      />
      <div class="relative mt-16">
        <div class="absolute left-[7%] right-[7%] top-8 hidden border-t border-dashed border-lime-300/25 xl:block" aria-hidden="true"></div>
        <ol class="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <li v-for="(step, index) in steps" :key="step.title" data-aos="fade-up" :data-aos-delay="index * 70" class="relative flex gap-4 text-left xl:block xl:text-center">
            <div class="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-[#071c16] bg-lime-300 text-emerald-950 shadow-lg shadow-black/20 xl:mx-auto">
              <component :is="step.icon" class="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-lime-300 xl:mt-6">Step {{ index + 1 }}</p>
              <h3 class="mt-2 font-bold text-white">{{ step.title }}</h3>
              <p class="mt-2 text-sm text-emerald-50/50">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
