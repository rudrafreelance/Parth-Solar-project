<script setup>
import { ArrowUpRight, Check } from '@lucide/vue'
import { servicePath } from './servicesData'

defineProps({
  service: { type: Object, required: true },
  active: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5"
    :class="active ? 'border-emerald-600/40 shadow-lg shadow-emerald-950/5' : 'border-emerald-950/10'"
  >
    <div class="relative overflow-hidden">
      <img
        :src="service.image"
        :alt="service.title"
        class="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
      <div class="absolute bottom-5 left-5 grid h-13 w-13 place-items-center rounded-2xl bg-lime-300 text-emerald-950 shadow-lg">
        <component :is="service.icon" class="h-6 w-6" aria-hidden="true" />
      </div>
    </div>
    <div class="flex flex-1 flex-col p-6 sm:p-7">
      <h3 class="text-xl font-bold text-emerald-950">{{ service.title }}</h3>
      <p class="mt-3 text-sm leading-6 text-slate-600">{{ service.description }}</p>
      <ul class="mt-5 space-y-2">
        <li
          v-for="benefit in service.benefits"
          :key="benefit"
          class="flex items-center gap-2 text-sm font-semibold text-emerald-950"
        >
          <span class="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Check class="h-3 w-3" stroke-width="3" aria-hidden="true" />
          </span>
          {{ benefit }}
        </li>
      </ul>
      <div class="mt-7 flex flex-wrap items-center gap-4">
        <RouterLink
          :to="servicePath(service.id)"
          class="inline-flex items-center gap-2 font-bold text-emerald-800 transition group-hover:gap-3 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
        >
          Open service
          <ArrowUpRight class="h-5 w-5" aria-hidden="true" />
        </RouterLink>
        <button
          type="button"
          class="text-sm font-semibold text-slate-500 transition hover:text-emerald-800"
          :aria-pressed="active"
          @click="$emit('select', service)"
        >
          Quick preview
        </button>
      </div>
    </div>
  </article>
</template>
