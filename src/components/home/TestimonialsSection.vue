<script setup>
import { Quote, Star } from '@lucide/vue'

const testimonials = [
  {
    quote: 'The whole process felt effortless. Every question was answered clearly, the crew was meticulous, and our first power bill dropped by more than half.',
    name: 'Maya & Daniel R.',
    role: 'Homeowners · Austin, TX',
    initials: 'MR',
  },
  {
    quote: 'Ideal Energy gave us a realistic business case and then delivered exactly what they promised. The system is already outperforming the original projection.',
    name: 'Marcus Chen',
    role: 'Operations Director · Phoenix, AZ',
    initials: 'MC',
  },
  {
    quote: 'From design through activation, we always knew what was happening next. It is rare to find this level of craftsmanship and communication together.',
    name: 'Elena Foster',
    role: 'Property Owner · Boulder, CO',
    initials: 'EF',
  },
]
</script>

<template>
  <section class="bg-white py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div class="mx-auto max-w-3xl text-center">
        <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Customer stories</p>
        <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-emerald-950 sm:text-5xl">
          Trusted where it matters most.
        </h2>
      </div>

      <div class="mt-14 grid gap-6 lg:grid-cols-3">
        <figure
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.name"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
          class="flex h-full flex-col rounded-[2rem] border border-emerald-950/10 bg-[#f8faf5] p-7 text-left sm:p-8"
        >
          <div class="flex items-center justify-between">
            <div class="flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
              <Star v-for="star in 5" :key="star" class="h-4 w-4 fill-current" aria-hidden="true" />
            </div>
            <Quote class="h-9 w-9 text-emerald-200" aria-hidden="true" />
          </div>
          <blockquote class="mt-7 flex-1 text-lg leading-8 text-emerald-950">
            “{{ testimonial.quote }}”
          </blockquote>
          <figcaption class="mt-8 flex items-center gap-4 border-t border-emerald-950/10 pt-6">
            <span class="grid h-12 w-12 place-items-center rounded-full bg-emerald-950 text-sm font-bold text-lime-300">
              {{ testimonial.initials }}
            </span>
            <span>
              <span class="block font-bold text-emerald-950">{{ testimonial.name }}</span>
              <span class="mt-1 block text-sm text-slate-500">{{ testimonial.role }}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
