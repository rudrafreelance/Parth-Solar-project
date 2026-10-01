<script setup>
import { ArrowRight, ChevronRight, Home } from '@lucide/vue'
</script>

<template>
  <section class="relative isolate flex min-h-[600px] items-end overflow-hidden bg-[#071c16] pb-20 pt-32 text-white sm:min-h-[660px] sm:pb-24 lg:pb-28">
    <img
      src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2200&q=85"
      alt="Expansive solar energy installation under clear sunlight"
      class="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
      fetchpriority="high"
    />
    <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#071c16] via-[#071c16]/85 to-[#071c16]/20"></div>

    <div class="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
      <nav data-aos="fade-down" aria-label="Breadcrumb">
        <ol class="flex items-center gap-2 text-sm text-emerald-50/65">
          <li><a href="/" class="inline-flex items-center gap-2 rounded transition hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"><Home class="h-4 w-4" aria-hidden="true" />Home</a></li>
          <li aria-hidden="true"><ChevronRight class="h-4 w-4" /></li>
          <li class="font-semibold text-lime-300" aria-current="page">Services</li>
        </ol>
      </nav>
      <h1 data-aos="fade-up" data-aos-delay="80" class="mt-7 max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
        Solar services in Ahmedabad.
      </h1>
      <p data-aos="fade-up" data-aos-delay="160" class="mt-7 max-w-2xl text-lg leading-8 text-emerald-50/70 sm:text-xl">
        Rooftop solar, commercial plants, batteries, maintenance, and PM Surya Ghar subsidy support for Ahmedabad and Gujarat.
      </p>
      <a data-aos="fade-up" data-aos-delay="240" href="#service-catalog" class="mt-9 inline-flex items-center gap-2 rounded-full bg-lime-300 px-7 py-4 font-bold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300">
        Explore our services
        <ArrowRight class="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  </section>
</template>
