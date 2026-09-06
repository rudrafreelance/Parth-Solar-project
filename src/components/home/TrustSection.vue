<script setup>
import { Award, BadgeCheck, ShieldCheck, Star } from '@lucide/vue'

const trustPoints = [
  { icon: ShieldCheck, title: 'Certified installers', detail: 'Fully licensed & insured' },
  { icon: Award, title: 'Industry-leading warranty', detail: '25-year performance cover' },
  { icon: Star, title: '4.9 / 5 customer rating', detail: 'From 1,200+ verified reviews' },
  { icon: BadgeCheck, title: 'Quality guaranteed', detail: 'Premium equipment only' },
]
</script>

<template>
  <section aria-label="Why customers trust us" class="border-b border-emerald-950/10 bg-[#f8faf5]">
    <div class="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-emerald-950/10 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4 lg:px-12">
      <div
        v-for="(point, index) in trustPoints"
        :key="point.title"
        data-aos="fade-up"
        :data-aos-delay="index * 80"
        class="flex items-center gap-4 py-7 sm:px-6 lg:py-8"
      >
        <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-950 text-lime-300">
          <component :is="point.icon" class="h-6 w-6" aria-hidden="true" />
        </div>
        <div class="text-left">
          <p class="font-bold text-emerald-950">{{ point.title }}</p>
          <p class="mt-1 text-sm text-slate-500">{{ point.detail }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
