<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const stats = [
  { value: 2400, suffix: '+', label: 'Projects completed' },
  { value: 2400, suffix: '+', label: 'Happy customers' },
  { value: 8, suffix: '+', label: 'Years of experience' },
  { value: 48, suffix: ' MW', label: 'Clean energy installed' },
]

const section = ref(null)
const values = ref(stats.map(() => 0))
let observer
let animationFrame
let hasAnimated = false

function animateCounters() {
  if (hasAnimated) return
  hasAnimated = true
  const start = performance.now()
  const duration = 1500

  function update(now) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    values.value = stats.map((stat) => Math.round(stat.value * eased))
    if (progress < 1) animationFrame = requestAnimationFrame(update)
  }

  animationFrame = requestAnimationFrame(update)
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animateCounters()
        observer.disconnect()
      }
    },
    { threshold: 0.25 },
  )
  observer.observe(section.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (animationFrame) cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <section ref="section" class="bg-lime-300 py-16 sm:py-20" aria-label="Company statistics">
    <div class="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        data-aos="zoom-in"
        :data-aos-delay="index * 80"
        class="text-center text-emerald-950"
      >
        <p class="text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
          {{ values[index].toLocaleString() }}{{ stat.suffix }}
        </p>
        <p class="mt-2 text-sm font-semibold text-emerald-950/65 sm:text-base">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>
