<script setup>
import { nextTick, ref, watch } from 'vue'
import { ChevronDown, MessageCircle, Phone, X } from '@lucide/vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  navItems: {
    type: Array,
    required: true,
  },
  services: {
    type: Array,
    required: true,
  },
  activeSection: {
    type: String,
    default: 'home',
  },
  phoneHref: {
    type: String,
    default: 'tel:+18005557652',
  },
  whatsappHref: {
    type: String,
    default: 'https://wa.me/18005557652',
  },
})

const emit = defineEmits(['close', 'navigate'])

const drawer = ref(null)
const servicesOpen = ref(false)

function closeMenu() {
  servicesOpen.value = false
  emit('close')
}

function navigateTo(section) {
  emit('navigate', section)
  closeMenu()
}

function trapFocus(event) {
  if (event.key === 'Escape') {
    closeMenu()
    return
  }

  if (event.key !== 'Tab' || !drawer.value) return

  const focusable = drawer.value.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    drawer.value?.focus()
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-if="open"
        type="button"
        class="fixed inset-0 z-50 cursor-default bg-emerald-950/45 backdrop-blur-sm lg:hidden"
        aria-label="Close navigation menu"
        tabindex="-1"
        @click="closeMenu"
      ></button>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
      enter-from-class="translate-x-full opacity-80"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-250 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-80"
    >
      <aside
        v-if="open"
        id="mobile-drawer"
        ref="drawer"
        class="fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col overflow-y-auto bg-white px-6 pb-8 pt-6 shadow-2xl outline-none lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        tabindex="-1"
        @keydown="trapFocus"
      >
        <div class="flex items-center justify-between border-b border-emerald-950/10 pb-5">
          <a
            href="/"
            class="flex items-center gap-2 text-lg font-bold tracking-[-0.03em] text-emerald-950 focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
            @click="navigateTo('home')"
          >
            <span class="grid h-9 w-9 place-items-center rounded-full bg-lime-300 text-emerald-950" aria-hidden="true">
              <span class="h-3.5 w-3.5 rounded-full border-[3px] border-current"></span>
            </span>
            SOLARA
          </a>
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-950 transition hover:rotate-90 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            aria-label="Close navigation menu"
            @click="closeMenu"
          >
            <X class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav class="mt-7" aria-label="Mobile navigation">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.label">
              <div v-if="item.label === 'Services'">
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-emerald-600"
                  :class="activeSection === item.section ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-800'"
                  :aria-expanded="servicesOpen"
                  aria-controls="mobile-services"
                  @click="servicesOpen = !servicesOpen"
                >
                  {{ item.label }}
                  <ChevronDown
                    class="h-4 w-4 transition-transform duration-300"
                    :class="{ 'rotate-180': servicesOpen }"
                    aria-hidden="true"
                  />
                </button>

                <div
                  id="mobile-services"
                  class="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                  :class="servicesOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                >
                  <ul class="min-h-0 space-y-1 overflow-hidden pl-4">
                    <li v-for="service in services" :key="service.label">
                      <a
                        :href="service.href"
                        class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-lime-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-600"
                        @click="navigateTo('services')"
                      >
                        {{ service.label }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <a
                v-else
                :href="item.href"
                class="block rounded-xl px-4 py-3.5 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-emerald-600"
                :class="activeSection === item.section ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-800'"
                @click="navigateTo(item.section)"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </nav>

        <div class="mt-auto border-t border-emerald-950/10 pt-7">
          <a
            href="#contact"
            class="flex w-full items-center justify-center rounded-full bg-lime-300 px-6 py-3.5 font-bold text-emerald-950 shadow-lg shadow-lime-300/20 transition hover:-translate-y-0.5 hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            @click="navigateTo('contact')"
          >
            Get Free Quote
          </a>
          <div class="mt-5 flex items-center justify-center gap-3">
            <a
              :href="phoneHref"
              class="grid h-11 w-11 place-items-center rounded-full border border-emerald-950/10 text-emerald-950 transition hover:border-emerald-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              aria-label="Call our solar advisors"
            >
              <Phone class="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              class="grid h-11 w-11 place-items-center rounded-full border border-emerald-950/10 text-emerald-950 transition hover:border-emerald-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle class="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
