<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircle2, Phone } from '@lucide/vue'
import { trackLeadConversion } from '@/composables/useAnalytics'

const route = useRoute()

const fromCalculator = computed(() => route.query.from === 'calculator')

onMounted(() => {
  trackLeadConversion({
    from: fromCalculator.value ? 'calculator' : route.query.from || 'contact',
  })
})
</script>

<template>
  <main class="flex min-h-[70vh] items-center justify-center bg-[radial-gradient(circle_at_20%_20%,_#edf4d2,_#ffffff_55%)] px-5 py-20 pt-28">
    <div class="max-w-xl text-center">
      <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-800">
        <CheckCircle2 class="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 class="mt-6 text-4xl font-bold tracking-[-0.035em] text-emerald-950">Thank you — we got your request.</h1>
      <p class="mt-4 text-lg leading-8 text-slate-600">
        <template v-if="fromCalculator">
          Your solar estimate is with our team. An advisor will call or WhatsApp you within one business day with a refined plan.
        </template>
        <template v-else>
          An Ideal Energy advisor will contact you within one business day about your solar project.
        </template>
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="tel:+916355859771"
          class="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-800"
        >
          <Phone class="h-4 w-4" aria-hidden="true" />
          Call 63558 59771
        </a>
        <RouterLink
          to="/"
          class="inline-flex items-center rounded-full border border-emerald-950/15 bg-white px-6 py-3.5 font-bold text-emerald-950 transition hover:bg-emerald-50"
        >
          Back to home
        </RouterLink>
      </div>
    </div>
  </main>
</template>
