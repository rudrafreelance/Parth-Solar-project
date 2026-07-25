<script setup>
import { BadgeCheck, Cpu, Gauge, PackageCheck, ShieldCheck, Wrench } from '@lucide/vue'
import ServicesHeading from './ServicesHeading.vue'

const features = [
  { icon: BadgeCheck, title: 'Government approved', text: 'Clear support for eligible policies, permits, and subsidy processes.' },
  { icon: PackageCheck, title: 'Premium brands', text: 'Proven panels, inverters, storage, and mounting technology.' },
  { icon: Wrench, title: 'Expert installation', text: 'Certified in-house teams with disciplined safety and workmanship.' },
  { icon: Cpu, title: 'Latest technology', text: 'Efficient components selected for reliability and future flexibility.' },
  { icon: Gauge, title: 'Live monitoring', text: 'Simple tools make production and system health easy to understand.' },
  { icon: ShieldCheck, title: 'Long warranty', text: 'Strong product, workmanship, and performance protection.' },
]
</script>

<template>
  <section class="bg-white py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <ServicesHeading
        eyebrow="Why choose our services"
        title="Premium equipment deserves premium execution."
        description="We bring engineering rigor, honest communication, and long-term accountability to every project."
      />
      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        <article v-for="(feature, index) in features" :key="feature.title" data-aos="fade-up" :data-aos-delay="(index % 3) * 90" class="group rounded-3xl border border-emerald-950/10 bg-[#f8faf5] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-600/25 hover:bg-white hover:shadow-xl hover:shadow-emerald-950/5 sm:p-8">
          <div class="grid h-13 w-13 place-items-center rounded-2xl bg-lime-200 text-emerald-950 transition group-hover:bg-emerald-950 group-hover:text-lime-300">
            <component :is="feature.icon" class="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 class="mt-6 text-xl font-bold text-emerald-950">{{ feature.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ feature.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
