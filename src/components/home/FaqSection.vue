<script setup>
import { ref } from 'vue'
import { Minus, Plus } from '@lucide/vue'

const faqs = [
  {
    question: 'How much can I save by going solar?',
    answer: 'Savings depend on your energy use, roof, utility rates, and local incentives. After a site review, we provide a transparent production and savings forecast based on your actual property.',
  },
  {
    question: 'What happens when the sun is not shining?',
    answer: 'Your home remains connected to the grid, so power continues normally. A battery can store excess daytime production for evenings, outages, or periods of lower sunlight.',
  },
  {
    question: 'How long does installation take?',
    answer: 'Most residential installations are completed in one to three days. Permitting and utility approval happen beforehand, and your project manager keeps you updated throughout.',
  },
  {
    question: 'Will solar panels damage my roof?',
    answer: 'No. Our certified team inspects your roof first and uses engineered mounting and weatherproofing methods. Properly installed panels can also shield roofing from sun and weather.',
  },
  {
    question: 'What maintenance do solar panels need?',
    answer: 'Solar panels have no moving parts and generally require very little maintenance. We monitor system health and will let you know if cleaning or service is ever recommended.',
  },
]

const openItem = ref(0)

function toggleItem(index) {
  openItem.value = openItem.value === index ? -1 : index
}
</script>

<template>
  <section class="bg-[#f3f6ef] py-20 sm:py-24 lg:py-32">
    <div class="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-20 lg:px-12">
      <div class="text-left">
        <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Questions, answered</p>
        <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-emerald-950 sm:text-5xl">
          Everything you need to know before going solar.
        </h2>
        <p data-aos="fade-up" data-aos-delay="160" class="mt-6 text-lg leading-8 text-slate-600">
          Still curious? Our energy advisors are happy to give you a straightforward answer.
        </p>
        <a data-aos="fade-up" data-aos-delay="240" href="#contact" class="mt-8 inline-flex rounded-full bg-emerald-950 px-6 py-3 font-bold text-white transition hover:bg-emerald-800">
          Ask us anything
        </a>
      </div>

      <div data-aos="fade-left" class="divide-y divide-emerald-950/10 border-y border-emerald-950/10">
        <div v-for="(faq, index) in faqs" :key="faq.question">
          <h3>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-bold text-emerald-950"
              :aria-expanded="openItem === index"
              :aria-controls="`faq-answer-${index}`"
              @click="toggleItem(index)"
            >
              {{ faq.question }}
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white">
                <Minus v-if="openItem === index" class="h-4 w-4" aria-hidden="true" />
                <Plus v-else class="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          </h3>
          <div
            v-show="openItem === index"
            :id="`faq-answer-${index}`"
            class="max-w-2xl pb-6 pr-12 text-left leading-7 text-slate-600"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
