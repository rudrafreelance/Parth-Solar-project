<script setup>
import { computed, onMounted } from 'vue'
import { ArrowUpRight, MapPin, Zap } from '@lucide/vue'
import { useProjects } from '@/composables/useProjects'

const { projects, fetchProjects } = useProjects()

const featuredProjects = computed(() => {
  const featured = projects.value.filter((project) => project.featured)
  return (featured.length ? featured : projects.value).slice(0, 3)
})

onMounted(() => {
  fetchProjects()
})
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
        <RouterLink
          data-aos="fade-left"
          to="/projects"
          class="inline-flex items-center gap-2 font-bold text-emerald-950 transition hover:gap-3 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
        >
          View all projects
          <ArrowUpRight class="h-5 w-5" aria-hidden="true" />
        </RouterLink>
      </div>

      <div class="mt-14 grid gap-6 lg:grid-cols-3">
        <article
          v-for="(project, index) in featuredProjects"
          :key="project.id"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
          class="group overflow-hidden rounded-[2rem] bg-white text-left shadow-sm"
        >
          <div class="relative overflow-hidden">
            <img
              :src="project.image_url"
              :alt="`${project.title} solar installation`"
              class="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
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
