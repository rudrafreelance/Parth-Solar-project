<script setup>
import { ChevronRight, Home } from '@lucide/vue'
</script>

<template>
  <section class="relative isolate flex min-h-[480px] items-end overflow-hidden bg-[#071c16] pb-16 pt-32 text-white sm:min-h-[540px] sm:pb-20">
    <img
      src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2200&q=85"
      alt="Completed Ideal Energy solar project"
      class="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
      fetchpriority="high"
    />
    <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#071c16] via-[#071c16]/85 to-[#071c16]/25"></div>

    <div class="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
      <nav data-aos="fade-down" aria-label="Breadcrumb">
        <ol class="flex items-center gap-2 text-sm text-emerald-50/65">
          <li>
            <RouterLink to="/" class="inline-flex items-center gap-2 rounded transition hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300">
              <Home class="h-4 w-4" aria-hidden="true" />
              Home
            </RouterLink>
          </li>
          <li aria-hidden="true"><ChevronRight class="h-4 w-4" /></li>
          <li class="font-semibold text-lime-300" aria-current="page">Projects</li>
        </ol>
      </nav>
      <h1 data-aos="fade-up" data-aos-delay="80" class="mt-7 max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
        Real projects. Lasting impact.
      </h1>
      <p data-aos="fade-up" data-aos-delay="160" class="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/70">
        Explore Ideal Energy installations across homes, businesses, and industrial sites—documented with real project photography.
      </p>
    </div>
  </section>
</template>
