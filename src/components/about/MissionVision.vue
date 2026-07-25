<script setup>
import { Eye, Target } from '@lucide/vue'
import SectionHeading from './SectionHeading.vue'

const principles = [
  {
    icon: Target,
    label: 'Our mission',
    title: 'Make exceptional solar accessible.',
    text: 'To give every customer a transparent path to lower energy costs through responsible design, premium technology, and support that lasts.',
  },
  {
    icon: Eye,
    label: 'Our vision',
    title: 'A future powered with confidence.',
    text: 'To help build resilient communities where clean, distributed energy is the dependable first choice for every home and organization.',
  },
]
</script>

<template>
  <section class="bg-[#f3f6ef] py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="What guides us"
        title="Clear purpose. Long-term thinking."
        description="Our work is measured not only in energy produced, but in the trust and lasting value each project creates."
      />
      <div class="mt-14 grid gap-6 lg:grid-cols-2 lg:mt-16">
        <article
          v-for="(principle, index) in principles"
          :key="principle.label"
          data-aos="zoom-in"
          :data-aos-delay="index * 100"
          class="group rounded-[2rem] border border-emerald-950/10 bg-white p-8 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-600/25 hover:shadow-xl hover:shadow-emerald-950/5 sm:p-10"
        >
          <div class="grid h-14 w-14 place-items-center rounded-2xl bg-lime-200 text-emerald-950 transition group-hover:bg-emerald-950 group-hover:text-lime-300">
            <component :is="principle.icon" class="h-7 w-7" aria-hidden="true" />
          </div>
          <p class="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">{{ principle.label }}</p>
          <h3 class="mt-3 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">{{ principle.title }}</h3>
          <p class="mt-5 leading-7 text-slate-600">{{ principle.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
