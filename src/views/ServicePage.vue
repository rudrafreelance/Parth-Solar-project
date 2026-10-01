<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, CheckCircle2 } from '@lucide/vue'
import ServicesCTA from '@/components/services/ServicesCTA.vue'
import { getServiceById, services, servicePath } from '@/components/services/servicesData'
import { getServiceSeo } from '@/data/localSeo'
import { openWhatsApp } from '@/lib/contact'

const route = useRoute()
const router = useRouter()

const service = computed(() => getServiceById(String(route.params.slug || '')))
const serviceSeo = computed(() => (service.value ? getServiceSeo(service.value.id) : null))

const related = computed(() =>
  services.filter((item) => item.id !== service.value?.id).slice(0, 3),
)

watch(
  service,
  (current) => {
    if (!current) router.replace({ name: 'services' })
  },
  { immediate: true },
)

function discussService() {
  if (!service.value) return
  openWhatsApp(
    `Hi Ideal Energy — I'm interested in ${service.value.title}. Please share details and next steps.`,
  )
}
</script>

<template>
  <main v-if="service">
    <section class="relative isolate overflow-hidden bg-[#071c16] pt-32 text-white sm:pt-36">
      <div class="absolute inset-0 -z-10">
        <img
          :src="service.image"
          :alt="service.title"
          class="h-full w-full object-cover opacity-35"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#071c16] via-[#071c16]/92 to-[#071c16]/55"></div>
      </div>

      <div class="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <RouterLink
          to="/services"
          class="inline-flex items-center gap-2 text-sm font-semibold text-lime-300 transition hover:text-lime-200"
        >
          <ArrowLeft class="h-4 w-4" aria-hidden="true" />
          All services
        </RouterLink>

        <div class="mt-8 grid max-w-3xl gap-6" data-aos="fade-up">
          <span class="grid h-14 w-14 place-items-center rounded-2xl bg-lime-300 text-emerald-950">
            <component :is="service.icon" class="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 class="text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {{ serviceSeo?.heading || service.title }}
          </h1>
          <p class="text-lg leading-8 text-emerald-50/75">{{ service.overview }}</p>
          <p v-if="serviceSeo?.localCopy" class="text-base leading-7 text-emerald-50/70">
            {{ serviceSeo.localCopy }}
          </p>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3.5 font-bold text-emerald-950 transition hover:bg-lime-200"
              @click="discussService"
            >
              Discuss this service
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </button>
            <RouterLink
              to="/calculator"
              class="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Get free estimate
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 sm:py-20">
      <div class="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-12">
        <div data-aos="fade-up">
          <p class="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Why choose this</p>
          <h2 class="mt-3 text-3xl font-bold tracking-[-0.03em] text-emerald-950">
            {{ service.description }}
          </h2>
          <ul class="mt-8 space-y-3">
            <li
              v-for="benefit in service.benefits"
              :key="benefit"
              class="flex items-start gap-3 text-base font-semibold text-emerald-950"
            >
              <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              {{ benefit }}
            </li>
          </ul>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" data-aos="fade-left">
          <div class="rounded-[1.75rem] bg-[#f3f6ef] p-6">
            <p class="text-sm font-bold uppercase tracking-wider text-emerald-700">Ideal for</p>
            <p class="mt-3 leading-7 text-slate-700">{{ service.idealCustomers }}</p>
          </div>
          <div class="rounded-[1.75rem] bg-[#f3f6ef] p-6">
            <p class="text-sm font-bold uppercase tracking-wider text-emerald-700">Typical timeline</p>
            <p class="mt-3 leading-7 text-slate-700">{{ service.timeline }}</p>
            <p class="mt-2 text-sm font-semibold text-emerald-900">Est. time: {{ service.installationTime }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#f3f6ef] py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <h2 class="text-3xl font-bold tracking-[-0.03em] text-emerald-950" data-aos="fade-up">
          Key features
        </h2>
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(feature, index) in service.features"
            :key="feature"
            class="rounded-[1.5rem] bg-white p-5 shadow-sm"
            data-aos="fade-up"
            :data-aos-delay="index * 60"
          >
            <CheckCircle2 class="h-5 w-5 text-emerald-700" aria-hidden="true" />
            <p class="mt-3 font-semibold text-emerald-950">{{ feature }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div class="flex items-end justify-between gap-4">
          <h2 class="text-3xl font-bold tracking-[-0.03em] text-emerald-950" data-aos="fade-up">
            Related services
          </h2>
          <RouterLink to="/services" class="text-sm font-bold text-emerald-800 hover:underline">
            View all
          </RouterLink>
        </div>
        <div class="mt-8 grid gap-5 sm:grid-cols-3">
          <RouterLink
            v-for="(item, index) in related"
            :key="item.id"
            :to="servicePath(item.id)"
            class="group rounded-[1.75rem] border border-emerald-950/10 bg-[#f8faf5] p-5 transition hover:-translate-y-1 hover:border-emerald-700/30 hover:shadow-lg"
            data-aos="fade-up"
            :data-aos-delay="index * 70"
          >
            <span class="grid h-11 w-11 place-items-center rounded-xl bg-lime-200 text-emerald-950">
              <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 class="mt-4 text-lg font-bold text-emerald-950">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.description }}</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <ServicesCTA />
  </main>
</template>
