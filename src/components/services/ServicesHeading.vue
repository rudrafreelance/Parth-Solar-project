<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dark: { type: Boolean, default: false },
  align: { type: String, default: 'center' },
})
</script>

<template>
  <div :class="align === 'left' ? 'text-left' : 'mx-auto max-w-3xl text-center'">
    <p data-aos="fade-up" class="text-sm font-bold uppercase tracking-[0.2em]" :class="dark ? 'text-lime-300' : 'text-emerald-700'">{{ eyebrow }}</p>
    <h2 data-aos="fade-up" data-aos-delay="80" class="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl" :class="dark ? 'text-white' : 'text-emerald-950'">
      {{ title }}
    </h2>
    <p v-if="description" data-aos="fade-up" data-aos-delay="160" class="mt-5 text-lg leading-8" :class="dark ? 'text-emerald-50/65' : 'text-slate-600'">
      {{ description }}
    </p>
  </div>
</template>
