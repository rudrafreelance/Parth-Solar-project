<script setup>
import { ArrowUpRight, BatteryCharging, Building2, HousePlug, Landmark } from '@lucide/vue'

const services = [
  {
    icon: HousePlug,
    number: '01',
    title: 'Home solar',
    text: 'A right-sized rooftop system designed around your home, usage, and goals.',
  },
  {
    icon: Building2,
    number: '02',
    title: 'Commercial solar',
    text: 'Turn unused roof space into predictable savings and measurable sustainability.',
  },
  {
    icon: BatteryCharging,
    number: '03',
    title: 'Battery storage',
    text: 'Keep essential power available and use more of the clean energy you produce.',
  },
  {
    icon: Landmark,
    number: '04',
    title: 'Solar financing',
    text: 'Flexible options that make ownership accessible without compromising quality.',
  },
]
</script>

<template>
  <section id="services" class="bg-[#071c16] py-20 text-white sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div class="flex flex-col items-start justify-between gap-7 text-left lg:flex-row lg:items-end">
        <div class="max-w-3xl">
          <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">What we do</p>
          <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-5xl">
            Clean energy solutions for every kind of property.
          </h2>
        </div>
        <p data-aos="fade-left" class="max-w-md text-lg leading-8 text-emerald-50/65">
          Practical systems, premium components, and one experienced team from start to finish.
        </p>
      </div>

      <div class="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 sm:grid-cols-2 lg:mt-16">
        <article
          v-for="(service, index) in services"
          :key="service.title"
          data-aos="fade-up"
          :data-aos-delay="(index % 2) * 100"
          class="group relative bg-[#0b261e] p-7 text-left transition hover:bg-[#103126] sm:p-9 lg:p-11"
        >
          <div class="flex items-center justify-between">
            <div class="grid h-14 w-14 place-items-center rounded-2xl bg-lime-300 text-emerald-950">
              <component :is="service.icon" class="h-7 w-7" aria-hidden="true" />
            </div>
            <span class="text-sm font-bold text-white/30">{{ service.number }}</span>
          </div>
          <h3 class="mt-10 text-2xl font-bold text-white">{{ service.title }}</h3>
          <p class="mt-4 max-w-md leading-7 text-emerald-50/60">{{ service.text }}</p>
          <a href="#contact" :aria-label="`Learn more about ${service.title}`" class="mt-8 inline-flex items-center gap-2 font-bold text-lime-300 transition group-hover:gap-3">
            Learn more
            <ArrowUpRight class="h-5 w-5" aria-hidden="true" />
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
