<template>
  <section class="mx-auto max-w-4xl px-4 pb-16 pt-32">
    <h1 class="text-3xl font-bold mb-4">Solar installation in Gujarat</h1>
    <p class="mb-4">
      Ideal Energy does solar installation in Gujarat for homes, shops, and factories. Most of our work is in Ahmedabad and nearby towns — Gandhinagar, Sanand, Naroda, Nikol, Bopal, and Gota — with the same crew for the survey, install, and subsidy paperwork.
    </p>
    <h2 class="text-2xl font-semibold mb-2">Solar installation in Ahmedabad and Gujarat</h2>
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
      Fill out the form below, see <RouterLink to="/solar-panel-price-ahmedabad" class="font-semibold underline">solar panel prices in Ahmedabad</RouterLink>, or call <strong>63558 59771</strong> for a free site assessment.
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
import { ref } from 'vue'
import { submitLead } from '@/lib/submitLead'

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
