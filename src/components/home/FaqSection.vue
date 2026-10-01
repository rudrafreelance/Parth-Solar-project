<script setup>
import { ref } from 'vue'
import { Minus, Plus } from '@lucide/vue'

import { homeFaqs as faqs } from '@/data/localSeo'

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
          Solar questions Ahmedabad homeowners ask first.
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
