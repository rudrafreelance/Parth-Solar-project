<script setup>
defineProps({
  /** light = dark text for white/light surfaces; dark = light text for green/dark surfaces; invert = lime mark on dark header */
  variant: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark', 'invert'].includes(value),
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
  sm: { mark: 'h-9 w-9', word: 'text-base', gap: 'gap-2' },
  md: { mark: 'h-10 w-10', word: 'text-lg sm:text-xl', gap: 'gap-2.5' },
  lg: { mark: 'h-11 w-11', word: 'text-xl', gap: 'gap-3' },
}
</script>

<template>
  <span class="inline-flex items-center" :class="sizeMap[size].gap">
    <span
      class="relative grid shrink-0 place-items-center overflow-hidden rounded-2xl shadow-sm transition duration-300 group-hover:scale-[1.03]"
      :class="[
        sizeMap[size].mark,
        variant === 'dark'
          ? 'bg-lime-300 text-emerald-950'
          : variant === 'invert'
            ? 'bg-lime-300 text-emerald-950'
            : 'bg-emerald-950 text-lime-300',
      ]"
      aria-hidden="true"
    >
      <svg class="h-[58%] w-[58%]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Sun core -->
        <circle cx="20" cy="16" r="6.5" fill="currentColor" />
        <!-- Rays -->
        <g stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <path d="M20 4.5V7" />
          <path d="M20 25V27.5" />
          <path d="M10.5 16H8" />
          <path d="M32 16H29.5" />
          <path d="M12.6 8.6L14.4 10.4" />
          <path d="M25.6 21.6L27.4 23.4" />
          <path d="M27.4 8.6L25.6 10.4" />
          <path d="M14.4 21.6L12.6 23.4" />
        </g>
        <!-- Leaf / energy base -->
        <path
          d="M11 31.5c4.2-1.2 7.4-3.8 9-6.8 1.6 3 4.8 5.6 9 6.8-3.4 2.4-7.2 3.2-9 3.2s-5.6-.8-9-3.2Z"
          fill="currentColor"
          opacity="0.92"
        />
      </svg>
    </span>

    <span
      v-if="showWordmark"
      class="flex flex-col leading-none"
      :class="variant === 'dark' || variant === 'invert' ? 'text-white' : 'text-emerald-950'"
    >
      <span class="font-extrabold tracking-[-0.045em]" :class="sizeMap[size].word">
        Ideal
        <span :class="variant === 'dark' || variant === 'invert' ? 'font-bold text-lime-300' : 'font-bold text-emerald-700'">
          Energy
        </span>
      </span>
    </span>
  </span>
</template>
