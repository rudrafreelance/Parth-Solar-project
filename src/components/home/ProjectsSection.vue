<script setup>
import { ArrowUpRight, MapPin, Zap } from '@lucide/vue'

const projects = [
  {
    title: 'Hillside family home',
    location: 'Austin, Texas',
    output: '12.4 kW',
    type: 'Residential',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Westfield distribution hub',
    location: 'Phoenix, Arizona',
    output: '286 kW',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Oak & Pine eco retreat',
    location: 'Boulder, Colorado',
    output: '48.6 kW',
    type: 'Hospitality',
    image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=85',
  },
]
</script>

<template>
  <section id="projects" class="bg-[#f3f6ef] py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div class="flex flex-col justify-between gap-7 text-left sm:flex-row sm:items-end">
        <div class="max-w-3xl">
          <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Featured work</p>
          <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-emerald-950 sm:text-5xl">
            Real projects. Lasting impact.
          </h2>
        </div>
        <a data-aos="fade-left" href="#contact" class="inline-flex items-center gap-2 font-bold text-emerald-950 transition hover:gap-3">
          View all projects
          <ArrowUpRight class="h-5 w-5" aria-hidden="true" />
        </a>
      </div>

      <div class="mt-14 grid gap-6 lg:grid-cols-3">
        <article
          v-for="(project, index) in projects"
          :key="project.title"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
          class="group overflow-hidden rounded-[2rem] bg-white text-left shadow-sm"
        >
          <div class="relative overflow-hidden">
            <img :src="project.image" :alt="`${project.title} solar installation`" class="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
            <span class="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-emerald-950 backdrop-blur">
              {{ project.type }}
            </span>
          </div>
          <div class="p-6 sm:p-7">
            <h3 class="text-xl font-bold text-emerald-950">{{ project.title }}</h3>
            <div class="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-emerald-950/10 pt-5 text-sm text-slate-600">
              <span class="inline-flex items-center gap-2">
                <MapPin class="h-4 w-4 text-emerald-600" aria-hidden="true" />
                {{ project.location }}
              </span>
              <span class="inline-flex items-center gap-2">
                <Zap class="h-4 w-4 text-emerald-600" aria-hidden="true" />
                {{ project.output }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
