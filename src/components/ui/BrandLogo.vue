<script setup>
defineProps({
  variant: {
    type: String,
    default: 'light',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  showWordmark: {
    type: Boolean,
    default: true,
  },
})

const sizeMap = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
}
</script>

<template>
  <span class="inline-flex items-center bg-white px-2 py-1.5 rounded-lg shadow-sm">
    <!-- Using the cropped logo image -->
    <img 
      src="/logo-cropped.png" 
      alt="Ideal Energy Logo" 
      class="w-auto object-contain"
      :class="sizeMap[size]"
    />
  </span>
</template>
