<script setup>
import { ArrowRight, Check } from '@lucide/vue'

const assurances = ['Free consultation', 'No-pressure proposal', 'Clear savings estimate']
</script>

<template>
  <section class="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
    <div
      data-aos="zoom-in"
      class="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-lime-300 px-6 py-16 text-emerald-950 sm:px-12 sm:py-20 lg:px-20"
    >
      <div class="absolute -right-20 -top-32 h-96 w-96 rounded-full border-[70px] border-emerald-950/5"></div>
      <div class="absolute -bottom-36 -left-24 h-80 w-80 rounded-full bg-white/25"></div>
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">Your brighter future starts here</p>
        <h2 class="mt-5 text-4xl font-bold leading-tight tracking-[-0.04em] text-emerald-950 sm:text-5xl lg:text-6xl">
          Ready to turn sunlight into savings?
        </h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-950/70">
          Get a tailored solar plan with real production numbers, honest pricing, and zero obligation.
        </p>
        <a
          href="#contact"
          class="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-950 px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
        >
          Calculate my solar potential
          <ArrowRight class="h-5 w-5" aria-hidden="true" />
        </a>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 text-sm font-semibold sm:flex-row sm:gap-7">
          <span v-for="item in assurances" :key="item" class="inline-flex items-center gap-2">
            <span class="grid h-5 w-5 place-items-center rounded-full bg-emerald-950 text-lime-300">
              <Check class="h-3 w-3" stroke-width="3" aria-hidden="true" />
            </span>
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
