<script setup>
import { MapPin, Zap } from '@lucide/vue'

defineProps({
  project: { type: Object, required: true },
})
</script>

<template>
  <article class="group overflow-hidden rounded-[2rem] bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5">
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
      <p v-if="project.description" class="mt-3 text-sm leading-6 text-slate-600">
        {{ project.description }}
      </p>
      <div class="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-emerald-950/10 pt-5 text-sm text-slate-600">
        <span v-if="project.location" class="inline-flex items-center gap-2">
          <MapPin class="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {{ project.location }}
        </span>
        <span v-if="project.output" class="inline-flex items-center gap-2">
          <Zap class="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {{ project.output }}
        </span>
      </div>
    </div>
  </article>
</template>
