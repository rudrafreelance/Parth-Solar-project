<script setup>
import { ArrowRight, MapPin, Phone } from '@lucide/vue'
</script>

<template>
  <section id="contact" class="bg-white px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-32">
    <div data-aos="zoom-in" class="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-lime-300 px-6 py-16 text-emerald-950 sm:px-12 sm:py-20 lg:px-20">
      <div class="absolute -right-20 -top-32 h-96 w-96 rounded-full border-[70px] border-emerald-950/5" aria-hidden="true"></div>
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">Let’s find your best solution</p>
        <h2 class="mt-5 text-4xl font-bold leading-tight tracking-[-0.04em] text-emerald-950 sm:text-5xl lg:text-6xl">Ready to put clean energy to work?</h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-950/70">Get an expert site review, clear recommendations, and a transparent proposal with no pressure.</p>
        <div class="mt-9 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
          <a href="#contact-form" class="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
            <MapPin class="h-5 w-5" aria-hidden="true" />Book Free Site Visit
          </a>
          <a href="#contact-form" class="inline-flex items-center justify-center gap-2 rounded-full bg-white/50 px-6 py-4 font-bold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
            Get Free Quote<ArrowRight class="h-5 w-5" aria-hidden="true" />
          </a>
          <a href="tel:+18005557652" class="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-950/20 px-6 py-4 font-bold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
            <Phone class="h-5 w-5" aria-hidden="true" />Call Now
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
