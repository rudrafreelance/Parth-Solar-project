<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight, Phone } from '@lucide/vue'
import { ensureGoogleAdsAttribution } from '@/composables/useLeadAttribution'

const route = useRoute()

onMounted(() => {
  const campaign = typeof route.query.utm_campaign === 'string' ? route.query.utm_campaign : 'rooftop_search'
  ensureGoogleAdsAttribution({ campaign })
})
</script>

<template>
  <main class="relative min-h-[100svh] overflow-hidden pt-28 text-white">
    <!-- Full-bleed hero visual -->
    <div class="absolute inset-0" aria-hidden="true">
      <img
        src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=85"
        alt=""
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#071c16]/95 via-[#071c16]/80 to-[#071c16]/45"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#071c16]/90 via-transparent to-[#071c16]/30"></div>
    </div>

    <div class="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <p class="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Ideal Energy</p>
      <h1 class="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
        Cut your power bill with rooftop solar — free savings estimate.
      </h1>
      <p class="mt-6 max-w-xl text-lg leading-8 text-emerald-50/75">
        See your system size, monthly savings, and payback in under a minute. An Ideal Energy advisor follows up the same business day.
      </p>

      <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <RouterLink
          to="/calculator"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-7 py-4 text-sm font-bold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-lime-200"
        >
          Get my free solar estimate
          <ArrowRight class="h-5 w-5" aria-hidden="true" />
        </RouterLink>
        <a
          href="tel:+916355859771"
          class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
        >
          <Phone class="h-4 w-4" aria-hidden="true" />
          Call 63558 59771
        </a>
      </div>

      <p class="mt-8 max-w-lg text-sm leading-6 text-emerald-50/55">
        Trusted rooftop solar for homes & businesses · Clear pricing · Subsidy guidance
      </p>

      <RouterLink
        to="/#contact"
        class="mt-6 inline-flex text-sm font-semibold text-lime-300/90 underline-offset-4 transition hover:underline"
      >
        Prefer a callback form instead →
      </RouterLink>
    </div>
  </main>
</template>
