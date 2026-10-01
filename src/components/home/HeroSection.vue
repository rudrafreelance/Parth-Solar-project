<script setup>
import { ArrowRight, BadgeCheck, Leaf, Sun, Zap } from '@lucide/vue'

const highlights = [
  { value: '2.4k+', label: 'homes powered' },
  { value: '40%', label: 'average savings' },
  { value: '8 yr', label: 'industry experience' },
]

const productionBars = ['h-[35%]', 'h-[48%]', 'h-[42%]', 'h-[68%]', 'h-[82%]', 'h-[74%]', 'h-[96%]']
</script>

<template>
  <section class="relative isolate overflow-hidden bg-[#071c16] text-white">
    <div class="absolute inset-0 -z-20">
      <img
        src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2200&q=85"
        alt="Solar panels capturing sunlight across a green landscape"
        class="h-full w-full object-cover opacity-30"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#071c16] via-[#071c16]/90 to-[#071c16]/35"></div>
    </div>
    <div class="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl"></div>

    <div class="mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 pb-24 pt-36 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-12 lg:pb-28 lg:pt-40">
      <div class="max-w-3xl text-left">
        <div
          data-aos="fade-down"
          class="mb-7 inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/10 px-4 py-2 text-sm font-semibold text-lime-200 backdrop-blur"
        >
          <Sun class="h-4 w-4" aria-hidden="true" />
          Ahmedabad solar company
        </div>

        <h1
          data-aos="fade-up"
          data-aos-delay="100"
          class="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
        >
          Solar panel installation
          <span class="text-lime-300">in Ahmedabad.</span>
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          class="mt-7 max-w-2xl text-lg leading-8 text-emerald-50/75 sm:text-xl"
        >
          Rooftop solar for homes, shops, and factories across Ahmedabad and Gujarat. Free site survey, clear pricing, and PM Surya Ghar subsidy help.
        </p>

        <div data-aos="fade-up" data-aos-delay="300" class="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#contact"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-7 py-4 text-base font-bold text-[#071c16] transition hover:-translate-y-0.5 hover:bg-lime-200 focus:outline-none focus:ring-4 focus:ring-lime-300/30"
          >
            Get your free solar plan
            <ArrowRight class="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="#projects"
            class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
          >
            Explore our projects
          </a>
        </div>

        <div data-aos="fade-up" data-aos-delay="400" class="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/15 pt-8">
          <div v-for="item in highlights" :key="item.label">
            <p class="text-2xl font-bold text-white sm:text-3xl">{{ item.value }}</p>
            <p class="mt-1 text-xs text-emerald-50/60 sm:text-sm">{{ item.label }}</p>
          </div>
        </div>
      </div>

      <div data-aos="fade-left" data-aos-delay="250" class="relative mx-auto hidden w-full max-w-md lg:block">
        <div class="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-emerald-50/60">Your energy today</p>
              <p class="mt-1 text-3xl font-bold">32.8 kWh</p>
            </div>
            <div class="rounded-2xl bg-lime-300 p-3 text-[#071c16]">
              <Zap class="h-6 w-6" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-8 flex h-40 items-end gap-3">
            <div
              v-for="barClass in productionBars"
              :key="barClass"
              class="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-500 to-lime-300"
              :class="barClass"
            ></div>
          </div>
          <div class="mt-3 flex justify-between text-xs text-emerald-50/50">
            <span>6 AM</span><span>Noon</span><span>6 PM</span>
          </div>
          <div class="mt-7 grid grid-cols-2 gap-3">
            <div class="rounded-2xl bg-black/15 p-4">
              <Leaf class="mb-2 h-5 w-5 text-lime-300" aria-hidden="true" />
              <p class="text-xl font-bold">4.2t</p>
              <p class="text-xs text-emerald-50/55">CO₂ avoided</p>
            </div>
            <div class="rounded-2xl bg-black/15 p-4">
              <BadgeCheck class="mb-2 h-5 w-5 text-lime-300" aria-hidden="true" />
              <p class="text-xl font-bold">98.6%</p>
              <p class="text-xs text-emerald-50/55">system uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
