<script setup>
import { BadgeDollarSign, BadgeCheck, Clock3, Headphones, PackageCheck, ShieldCheck, Wrench } from '@lucide/vue'
import SectionHeading from './SectionHeading.vue'

const trustItems = [
  { icon: BadgeCheck, title: 'Certified engineers', text: 'Qualified professionals design every system to rigorous standards.' },
  { icon: PackageCheck, title: 'Premium products', text: 'Only proven tier-one panels, inverters, and mounting systems.' },
  { icon: Clock3, title: 'Fast installation', text: 'Disciplined planning keeps your project moving without compromise.' },
  { icon: ShieldCheck, title: 'Subsidy support', text: 'Clear guidance through eligible government programs and paperwork.' },
  { icon: BadgeDollarSign, title: 'Affordable pricing', text: 'Transparent proposals designed around genuine lifetime value.' },
  { icon: Wrench, title: '25-year warranty', text: 'Long-term product and performance protection for peace of mind.' },
  { icon: Headphones, title: '24×7 support', text: 'Responsive system monitoring and help whenever you need it.' },
]
</script>

<template>
  <section class="bg-white py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Why customers trust us"
        title="Confidence built into every detail."
        description="From the equipment we specify to the support we provide, every decision protects your investment."
      />
      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        <article
          v-for="(item, index) in trustItems"
          :key="item.title"
          data-aos="fade-up"
          :data-aos-delay="(index % 4) * 70"
          class="group rounded-3xl border border-emerald-950/10 bg-[#f8faf5] p-7 text-left transition duration-300 hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-xl"
          :class="{ 'lg:col-span-2': index === trustItems.length - 1 }"
        >
          <div class="grid h-12 w-12 place-items-center rounded-2xl bg-lime-200 text-emerald-950 transition group-hover:bg-lime-300">
            <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 class="mt-6 text-xl font-bold text-emerald-950 transition group-hover:text-white">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-6 text-slate-600 transition group-hover:text-emerald-50/65">{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
