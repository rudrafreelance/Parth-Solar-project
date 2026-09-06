<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isPrivacy = computed(() => route.name === 'privacy')

const title = computed(() => (isPrivacy.value ? 'Privacy Policy' : 'Terms & Conditions'))

const updated = '31 July 2026'

const privacySections = [
  {
    heading: 'Information we collect',
    body: 'When you request a solar plan, use the calculator, or chat with us, we may collect your name, phone number, address or PIN code, message details, and marketing attribution (such as UTM parameters).',
  },
  {
    heading: 'How we use information',
    body: 'We use your details to respond to enquiries, prepare quotes, schedule site visits, improve our website, and send service-related updates. We do not sell your personal data.',
  },
  {
    heading: 'Sharing',
    body: 'We may share information with trusted service providers (for example hosting, email, or WhatsApp notification tools) solely to operate Ideal Energy services. Legal requests may also require disclosure.',
  },
  {
    heading: 'Contact',
    body: 'For privacy questions, email idealeneergy@gmail.com or call +91 63558 59771.',
  },
]

const termsSections = [
  {
    heading: 'Estimates and quotes',
    body: 'Website calculator results and online estimates are indicative only. Final system size, pricing, subsidy eligibility, and timelines depend on a site survey, DISCOM rules, and current schemes.',
  },
  {
    heading: 'Services',
    body: 'Ideal Energy provides solar design, installation, and related services in India. Scope, warranties, and payment terms are confirmed in a written proposal or agreement before work begins.',
  },
  {
    heading: 'Website use',
    body: 'You agree not to misuse this website, attempt unauthorized access, or submit false contact information. Content on this site is for general information and may change without notice.',
  },
  {
    heading: 'Contact',
    body: 'Questions about these terms: idealeneergy@gmail.com or +91 63558 59771.',
  },
]

const sections = computed(() => (isPrivacy.value ? privacySections : termsSections))
</script>

<template>
  <main class="min-h-[70vh] bg-[radial-gradient(circle_at_top_left,_#edf4d2_0%,_#ffffff_50%,_#f3f6ef_100%)] pt-28 pb-20">
    <div class="mx-auto max-w-3xl px-5 sm:px-8">
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Ideal Energy</p>
      <h1 class="mt-3 text-4xl font-bold tracking-[-0.035em] text-emerald-950">{{ title }}</h1>
      <p class="mt-3 text-sm text-slate-500">Last updated {{ updated }}</p>

      <div class="mt-10 space-y-8">
        <section v-for="section in sections" :key="section.heading">
          <h2 class="text-lg font-bold text-emerald-950">{{ section.heading }}</h2>
          <p class="mt-2 text-base leading-7 text-slate-600">{{ section.body }}</p>
        </section>
      </div>

      <RouterLink
        to="/"
        class="mt-12 inline-flex font-semibold text-emerald-800 underline-offset-4 hover:underline"
      >
        ← Back to home
      </RouterLink>
    </div>
  </main>
</template>
