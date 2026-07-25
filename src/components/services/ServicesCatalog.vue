<script setup>
import { nextTick, ref } from 'vue'
import ServiceCard from './ServiceCard.vue'
import ServiceDetails from './ServiceDetails.vue'
import ServicesHeading from './ServicesHeading.vue'
import { services } from './servicesData'

const selectedService = ref(services[0])
const details = ref(null)

async function selectService(service) {
  selectedService.value = service
  await nextTick()
  details.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <section id="service-catalog" class="bg-[#f3f6ef] py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <ServicesHeading
        eyebrow="Our services"
        title="The right solution for every energy goal."
        description="Explore complete solar, storage, pumping, heating, and care services delivered by one accountable team."
      />

      <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="(service, index) in services" :key="service.id" data-aos="fade-up" :data-aos-delay="(index % 4) * 70">
          <ServiceCard :service="service" :active="selectedService.id === service.id" @select="selectService" />
        </div>
      </div>

      <div class="mt-14 lg:mt-20">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-y-3 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-2 opacity-0"
        >
          <ServiceDetails ref="details" :key="selectedService.id" :service="selectedService" />
        </Transition>
      </div>
    </div>
  </section>
</template>
