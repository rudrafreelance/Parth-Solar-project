<script setup>
import { Award, BadgeCheck, Building2, ShieldCheck } from '@lucide/vue'
import SectionHeading from './SectionHeading.vue'

const certifications = [
  { icon: Award, code: 'ISO', title: 'ISO Certified', text: 'Quality-managed processes across design and delivery.' },
  { icon: BadgeCheck, code: 'MNRE', title: 'MNRE Standards', text: 'Systems aligned with recognized renewable energy standards.' },
  { icon: Building2, code: 'GOV', title: 'Government Approved', text: 'Qualified guidance for applicable programs and approvals.' },
  { icon: ShieldCheck, code: '25Y', title: 'Protected Performance', text: 'Industry-leading product and output warranty coverage.' },
]
</script>

<template>
  <section class="bg-[#f3f6ef] py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Certifications"
        title="Standards you can depend on."
        description="Our quality credentials reflect a disciplined commitment to safe installation, dependable equipment, and accountable service."
      />
      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        <article
          v-for="(item, index) in certifications"
          :key="item.title"
          data-aos="fade-up"
          :data-aos-delay="index * 80"
          class="group rounded-3xl border border-emerald-950/10 bg-white p-7 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5"
        >
          <div class="relative mx-auto grid h-20 w-20 place-items-center rounded-full border border-emerald-950/10 bg-[#f8faf5] text-emerald-950 transition group-hover:border-lime-300 group-hover:bg-lime-200">
            <component :is="item.icon" class="h-8 w-8" aria-hidden="true" />
            <span class="absolute -bottom-2 rounded-full bg-emerald-950 px-2.5 py-1 text-[10px] font-bold tracking-wider text-lime-300">{{ item.code }}</span>
          </div>
          <h3 class="mt-7 text-lg font-bold text-emerald-950">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-6 text-slate-600">{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
