<script setup>
import { ref } from 'vue'
import { Minus, Plus } from '@lucide/vue'
import ServicesHeading from './ServicesHeading.vue'

const faqs = [
  { question: 'Which solar service is right for my property?', answer: 'We begin with your energy use, available space, priorities, and budget. A complimentary consultation and site survey let us recommend the right system without oversizing.' },
  { question: 'Can you add batteries to an existing solar system?', answer: 'Usually, yes. We review your inverter, electrical setup, critical loads, and available space before recommending a compatible storage solution.' },
  { question: 'Do you handle permits and government subsidy paperwork?', answer: 'Yes. Our project team manages applicable permits, utility coordination, net-metering documents, and guidance for eligible subsidy programs.' },
  { question: 'How long does a typical installation take?', answer: 'Residential work commonly takes one to three days on site. Larger commercial and industrial systems vary by size, approvals, and electrical complexity.' },
  { question: 'What maintenance does a solar system require?', answer: 'Solar systems need limited care, but periodic cleaning, electrical inspection, monitoring, and preventive checks help protect output and identify issues early.' },
  { question: 'Are your systems covered by warranty?', answer: 'Yes. Coverage depends on the selected equipment and service, with premium panels commonly carrying long-term product and performance warranties.' },
]

const openItem = ref(0)

function toggle(index) {
  openItem.value = openItem.value === index ? -1 : index
}
</script>

<template>
  <section class="bg-white py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-4xl px-5 sm:px-8">
      <ServicesHeading
        eyebrow="Frequently asked questions"
        title="Straight answers before you get started."
        description="Everything you need to take the next step with confidence."
      />
      <div data-aos="fade-up" class="mt-14 divide-y divide-emerald-950/10 border-y border-emerald-950/10">
        <div v-for="(faq, index) in faqs" :key="faq.question">
          <h3>
            <button type="button" class="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-bold text-emerald-950 focus-visible:outline-2 focus-visible:outline-emerald-600" :aria-expanded="openItem === index" :aria-controls="`service-faq-${index}`" @click="toggle(index)">
              {{ faq.question }}
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f3f6ef]">
                <Minus v-if="openItem === index" class="h-4 w-4" aria-hidden="true" />
                <Plus v-else class="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          </h3>
          <div class="grid transition-[grid-template-rows] duration-300 ease-out" :class="openItem === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
            <div :id="`service-faq-${index}`" class="min-h-0 overflow-hidden" :aria-hidden="openItem !== index">
              <p class="max-w-3xl pb-6 pr-12 text-left leading-7 text-slate-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
