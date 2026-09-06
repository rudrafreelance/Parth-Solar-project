<script setup>
import { CheckCircle2, Clock3, Sparkles, Users } from '@lucide/vue'

defineProps({
  service: { type: Object, required: true },
})
</script>

<template>
  <article class="overflow-hidden rounded-[2rem] bg-[#071c16] text-white shadow-2xl shadow-emerald-950/10">
    <div class="grid lg:grid-cols-[.8fr_1.2fr]">
      <div class="relative min-h-72 overflow-hidden lg:min-h-full">
        <img :src="service.image" :alt="`${service.title} service overview`" class="absolute inset-0 h-full w-full object-cover opacity-55" loading="lazy" decoding="async" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#071c16] via-transparent to-transparent lg:bg-gradient-to-r"></div>
        <div class="absolute bottom-7 left-7">
          <div class="grid h-14 w-14 place-items-center rounded-2xl bg-lime-300 text-emerald-950">
            <component :is="service.icon" class="h-7 w-7" aria-hidden="true" />
          </div>
          <h3 class="mt-5 text-3xl font-bold text-white">{{ service.title }}</h3>
        </div>
      </div>

      <div class="p-7 text-left sm:p-10 lg:p-12">
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-lime-300">Service overview</p>
        <p class="mt-4 text-lg leading-8 text-emerald-50/70">{{ service.overview }}</p>

        <div class="mt-9 grid gap-5 sm:grid-cols-2">
          <div class="rounded-2xl bg-white/[0.06] p-5">
            <Users class="h-5 w-5 text-lime-300" aria-hidden="true" />
            <h4 class="mt-3 font-bold text-white">Ideal customers</h4>
            <p class="mt-2 text-sm leading-6 text-emerald-50/60">{{ service.idealCustomers }}</p>
          </div>
          <div class="rounded-2xl bg-white/[0.06] p-5">
            <Clock3 class="h-5 w-5 text-lime-300" aria-hidden="true" />
            <h4 class="mt-3 font-bold text-white">Estimated time</h4>
            <p class="mt-2 text-sm leading-6 text-emerald-50/60">{{ service.installationTime }}</p>
          </div>
        </div>

        <div class="mt-8 grid gap-7 sm:grid-cols-2">
          <div>
            <h4 class="flex items-center gap-2 font-bold text-white"><Sparkles class="h-5 w-5 text-lime-300" aria-hidden="true" />Key features</h4>
            <ul class="mt-4 space-y-3">
              <li v-for="feature in service.features" :key="feature" class="flex gap-2 text-sm text-emerald-50/65">
                <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-lime-300" aria-hidden="true" />{{ feature }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white">Project timeline</h4>
            <p class="mt-4 text-sm leading-6 text-emerald-50/65">{{ service.timeline }}</p>
            <a href="#contact" class="mt-5 inline-flex rounded-full bg-lime-300 px-5 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300">
              Discuss this service
            </a>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
