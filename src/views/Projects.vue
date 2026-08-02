<script setup>
import { computed, onMounted, ref } from 'vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import ProjectsHero from '@/components/projects/ProjectsHero.vue'
import { useProjects } from '@/composables/useProjects'

const { projects, loading, error, fetchProjects } = useProjects()
const activeFilter = ref('All')

const filters = computed(() => {
  const types = [...new Set(projects.value.map((project) => project.type).filter(Boolean))]
  return ['All', ...types]
})

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return projects.value
  return projects.value.filter((project) => project.type === activeFilter.value)
})

onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <main>
    <ProjectsHero />

    <section class="bg-[#f3f6ef] py-16 sm:py-20 lg:py-28">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div class="max-w-2xl text-left">
            <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Portfolio</p>
            <h2 data-aos="fade-up" data-aos-delay="80" class="mt-3 text-3xl font-bold tracking-[-0.03em] text-emerald-950 sm:text-4xl">
              All Ideal Energy projects
            </h2>
          </div>

          <div data-aos="fade-left" class="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by type">
            <button
              v-for="filter in filters"
              :key="filter"
              type="button"
              role="tab"
              class="rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              :class="activeFilter === filter ? 'bg-emerald-950 text-white' : 'bg-white text-emerald-950 hover:bg-emerald-50'"
              :aria-selected="activeFilter === filter"
              @click="activeFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <p v-if="loading" class="mt-14 text-center text-slate-600">Loading projects…</p>
        <p v-else-if="error" class="mt-14 text-center text-sm text-amber-700">
          Could not reach Supabase ({{ error }}). Showing sample projects until your connection is ready.
        </p>

        <div v-if="!loading" class="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          <div
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            data-aos="fade-up"
            :data-aos-delay="(index % 3) * 80"
          >
            <ProjectCard :project="project" />
          </div>
        </div>

        <p v-if="!loading && !filteredProjects.length" class="mt-16 text-center text-slate-600">
          No projects in this category yet.
        </p>
      </div>
    </section>
  </main>
</template>
