<template>
  <section class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold mb-4">Solar Panels Gujarat – Premium Solar Solutions</h1>
    <p class="mb-4">
      Ideal Energy provides high‑quality solar panel installations across Gujarat. Whether you need a rooftop system for your home in Ahmedabad or a commercial solar solution for your business, we have the expertise to design, install, and maintain your system.
    </p>
    <h2 class="text-2xl font-semibold mb-2">Why Choose Solar Panels in Gujarat?</h2>
    <ul class="list-disc list-inside mb-4">
      <li>Significant reduction in electricity bills – up to 90% savings.</li>
      <li>Eligible for the <strong>PM Surya Ghar Yojana</strong> subsidy.</li>
      <li>Professional installation by certified engineers.</li>
      <li>Local support and maintenance.</li>
    </ul>
    <h2 class="text-2xl font-semibold mb-2">Our Services</h2>
    <p class="mb-4">We offer residential rooftop solar, commercial solar, industrial solar, battery storage, solar pumps, and full‑service maintenance contracts.</p>
    <h2 class="text-2xl font-semibold mb-2">Get a Free Quote</h2>
    <p class="mb-4">
      Fill out the form below or call us at <strong>63558 59771</strong> for a free site assessment and customized quote.
    </p>
    <!-- Simple contact form placeholder -->
    <form class="grid gap-4" @submit.prevent="submitForm">
      <input v-model="name" placeholder="Your Name" required class="border p-2 rounded" />
      <input v-model="email" type="email" placeholder="Your Email" required class="border p-2 rounded" />
      <input v-model="phone" placeholder="Phone" required class="border p-2 rounded" />
      <textarea v-model="message" placeholder="Message" class="border p-2 rounded" rows="4"></textarea>
      <button type="submit" class="bg-emerald-600 text-white py-2 rounded">Request Quote</button>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { submitLead } from '@/lib/submitLead'

useHead({
  title: 'Solar Panels Gujarat – Ideal Energy | Premium Solar Solutions',
  meta: [
    { name: 'description', content: 'Looking for solar panels in Gujarat? Ideal Energy provides premium residential and commercial solar installations across Gujarat with government subsidies and expert support.' },
    { name: 'keywords', content: 'Solar Panel, Solar Rooftop, Solar Panel Price, Solar System for Home, Rooftop Solar, Solar Panel Installation, Solar EPC Company, Solar Subsidy, 3 kW Solar System, Solar Panel Price in Ahmedabad, Solar Company in Ahmedabad, Rooftop Solar Ahmedabad, Solar Panel Price Ahmedabad, Solar EPC Ahmedabad, Residential Solar Ahmedabad, solar panels Gujarat' },
    { name: 'canonical', content: 'https://www.ideal-energy.in/solar-panels-gujarat' }
  ]
})
onMounted(() => {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Solar panel installation cost in Gujarat",
        "acceptedAnswer": { "@type": "Answer", "text": "Cost varies by system size; typical residential 5kW starts around ₹3‑4 Lakhs after PM Surya Ghar Yojana subsidy." }
      },
      {
        "@type": "Question",
        "name": "How long does a solar installation take in Gujarat?",
        "acceptedAnswer": { "@type": "Answer", "text": "From site survey to commissioning usually 2‑4 weeks depending on permitting and roof conditions." }
      },
      {
        "@type": "Question",
        "name": "What subsidies are available for solar in Gujarat?",
        "acceptedAnswer": { "@type": "Answer", "text": "PM Surya Ghar Yojana provides up to 30% subsidy on rooftop solar for residential customers, plus state‑level net‑metering incentives." }
      },
      {
        "@type": "Question",
        "name": "Can I get a free quote for solar panels in Gujarat?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes – fill the form on this page or call 63558 59771 for a no‑obligation site assessment and quote." }
      },
      {
        "@type": "Question",
        "name": "What is the payback period for solar panels in Gujarat?",
        "acceptedAnswer": { "@type": "Answer", "text": "Typically 5‑7 years after accounting for electricity savings and available subsidies." }
      }
    ]
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(faq)
  document.head.appendChild(script)
})

const name = ref('')
const email = ref('')
const phone = ref('')
const message = ref('')

async function submitForm() {
  try {
    await submitLead({
      firstName: name.value,
      lastName: '',
      phone: phone.value,
      email: email.value,
      address: '',
      message: message.value,
      sourceFallback: 'solar-panels-gujarat',
    })
    alert(`Thank you, ${name.value}. We will contact you soon at ${email.value}.`)
    name.value = ''
    email.value = ''
    phone.value = ''
    message.value = ''
  } catch (e) {
    console.error(e)
    alert('Failed to submit your request. Please try again later.')
  }
}
</script>

<style scoped>
section { max-width: 800px; }
</style>
