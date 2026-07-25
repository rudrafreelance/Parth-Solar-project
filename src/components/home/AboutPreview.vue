<script setup>
import { ArrowUpRight, CheckCircle2, Play } from '@lucide/vue'

const benefits = [
  'Site-specific system design',
  'Clear pricing with no surprises',
  'One dedicated project manager',
]
</script>

<template>
  <section id="about" class="overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
    <div class="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
      <div data-aos="fade-right" class="relative">
        <div class="overflow-hidden rounded-[2rem]">
          <img
            src="https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=1200&q=85"
            alt="Solar technicians inspecting rooftop panels"
            class="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
          />
        </div>
        <div class="absolute -bottom-6 -right-2 max-w-[15rem] rounded-3xl bg-lime-300 p-5 text-left text-emerald-950 shadow-xl sm:right-6 sm:p-6">
          <p class="text-4xl font-bold tracking-tight">15+</p>
          <p class="mt-1 text-sm font-semibold leading-5">years building a cleaner energy future</p>
        </div>
        <button
          type="button"
          aria-label="Play our story"
          class="absolute left-6 top-6 grid h-14 w-14 place-items-center rounded-full bg-white text-emerald-950 shadow-lg transition hover:scale-105"
        >
          <Play class="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
        </button>
      </div>

      <div class="text-left">
        <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">About Solara</p>
        <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-emerald-950 sm:text-5xl">
          Energy independence starts with a better plan.
        </h2>
        <p data-aos="fade-up" data-aos-delay="160" class="mt-6 text-lg leading-8 text-slate-600">
          We pair thoughtful engineering with honest guidance to create solar systems that perform beautifully for decades—not just on installation day.
        </p>

        <ul data-aos="fade-up" data-aos-delay="240" class="mt-8 space-y-4">
          <li v-for="benefit in benefits" :key="benefit" class="flex items-center gap-3 font-semibold text-emerald-950">
            <CheckCircle2 class="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            {{ benefit }}
          </li>
        </ul>

        <a
          data-aos="fade-up"
          data-aos-delay="320"
          href="#contact"
          class="mt-10 inline-flex items-center gap-2 border-b-2 border-lime-400 pb-1 font-bold text-emerald-950 transition hover:gap-3"
        >
          Meet the people behind the panels
          <ArrowUpRight class="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
</template>
