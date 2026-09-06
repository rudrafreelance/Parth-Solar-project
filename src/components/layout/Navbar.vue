<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowUpRight,
  BatteryCharging,
  Building2,
  ChevronDown,
  Factory,
  FileBadge,
  House,
  Mail,
  MessageCircle,
  Phone,
  Wrench,
} from '@lucide/vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import MobileMenu from './MobileMenu.vue'
import {
  ADMIN_EMAIL,
  ADMIN_EMAIL_HREF,
  ADMIN_PHONE_DISPLAY,
  ADMIN_TEL_HREF,
  ADMIN_WHATSAPP_HREF,
  SOCIAL_LINKS,
} from '@/lib/contact'

const route = useRoute()

defineProps({
  quoteHref: {
    type: String,
    default: '#contact',
  },
  phoneHref: {
    type: String,
    default: ADMIN_TEL_HREF,
  },
  whatsappHref: {
    type: String,
    default: ADMIN_WHATSAPP_HREF,
  },
})

const socialLinks = SOCIAL_LINKS.filter((s) => ['instagram', 'facebook'].includes(s.icon))
const adminEmail = ADMIN_EMAIL
const adminEmailHref = ADMIN_EMAIL_HREF
const adminPhoneDisplay = ADMIN_PHONE_DISPLAY
const adminTelHref = ADMIN_TEL_HREF

const navItems = [
  { label: 'Home', href: '/', section: 'home' },
  { label: 'About', href: '/about', section: 'about' },
  { label: 'Services', href: '/services', section: 'services' },
  { label: 'Projects', href: '/projects', section: 'projects' },
  { label: 'Calculator', href: '/calculator', section: 'calculator' },
  { label: 'Contact', href: '/#contact', section: 'contact' },
]

const services = [
  { label: 'Residential Solar', description: 'Clean power designed around your home.', href: '/services/residential', icon: House },
  { label: 'Commercial Solar', description: 'Predictable savings for growing businesses.', href: '/services/commercial', icon: Building2 },
  { label: 'Industrial Solar', description: 'High-output systems for complex operations.', href: '/services/industrial', icon: Factory },
  { label: 'Maintenance', description: 'Monitoring and care for lasting performance.', href: '/services/maintenance', icon: Wrench },
  { label: 'Battery Storage', description: 'Store more energy and stay prepared.', href: '/services/battery', icon: BatteryCharging },
  { label: 'Government Subsidy', description: 'Clear guidance through available programs.', href: '/services/government-subsidy', icon: FileBadge },
]

const isScrolled = ref(false)
const mobileOpen = ref(false)
const servicesOpen = ref(false)
const activeSection = ref('home')
const menuButton = ref(null)
const servicesMenu = ref(null)

const isAdminRoute = computed(() => String(route.path || '').startsWith('/admin'))
const isHomeHero = computed(() => route.name === 'home')

/** Solid nav chrome on inner pages / scroll; glass only on home hero. */
const solidHeader = computed(
  () => !isHomeHero.value || isScrolled.value || mobileOpen.value || isAdminRoute.value,
)

function getServicesMenuElement() {
  return Array.isArray(servicesMenu.value) ? servicesMenu.value[0] : servicesMenu.value
}

function updateScrollState() {
  isScrolled.value = window.scrollY > 24
  if (route.name === 'home' && window.scrollY < 120 && !route.hash) {
    activeSection.value = 'home'
  }
}

function closeServices(event) {
  if (event?.relatedTarget && getServicesMenuElement()?.contains(event.relatedTarget)) return
  servicesOpen.value = false
}

function handleDocumentClick(event) {
  if (!getServicesMenuElement()?.contains(event.target)) servicesOpen.value = false
}

function handleNavigation(section) {
  activeSection.value = section
  servicesOpen.value = false
}

function openMobileMenu() {
  mobileOpen.value = true
}

function closeMobileMenu() {
  mobileOpen.value = false
}

let sectionObserver

function syncActiveFromRoute() {
  if (route.name && route.name !== 'home') {
    activeSection.value = String(route.name).replace('admin-', '')
    return
  }
  if (route.hash) {
    activeSection.value = route.hash.replace('#', '') || 'home'
    return
  }
  activeSection.value = 'home'
}

onMounted(() => {
  updateScrollState()
  syncActiveFromRoute()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  document.addEventListener('click', handleDocumentClick)

  const sections = ['about', 'services', 'projects', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean)

  sectionObserver = new IntersectionObserver(
    (entries) => {
      if (route.name !== 'home') return
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (visibleSection) activeSection.value = visibleSection.target.id
    },
    { rootMargin: '-30% 0px -55%', threshold: [0, 0.2, 0.5] },
  )

  sections.forEach((section) => sectionObserver.observe(section))
})

watch(() => route.fullPath, syncActiveFromRoute)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
  document.removeEventListener('click', handleDocumentClick)
  sectionObserver?.disconnect()
})

watch(mobileOpen, async (isOpen) => {
  if (isOpen) return
  await nextTick()
  menuButton.value?.focus()
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40">
    <!-- Always-solid top strip — separate from main nav -->
    <div class="relative z-20 bg-emerald-950 text-white">
      <div class="mx-auto flex h-9 max-w-7xl items-center justify-between gap-3 px-5 text-[11px] sm:h-10 sm:px-8 sm:text-xs lg:px-12">
        <div class="flex items-center gap-3 sm:gap-4">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-white/85 transition hover:text-lime-300"
            :aria-label="social.label"
          >
            <svg
              v-if="social.icon === 'instagram'"
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
            </svg>
            <svg v-else class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M14 21v-8h2.8l.42-3H14V8.08c0-.87.25-1.46 1.6-1.46h1.7V3.94c-.3-.04-1.3-.13-2.48-.13-2.46 0-4.15 1.5-4.15 4.27V10H8v3h2.67v8H14Z"></path>
            </svg>
            <span class="hidden capitalize sm:inline">{{ social.label.toLowerCase() }}</span>
          </a>
        </div>
        <div class="flex min-w-0 items-center gap-3 sm:gap-5">
          <a
            :href="adminEmailHref"
            class="inline-flex min-w-0 items-center gap-1.5 truncate text-white/90 transition hover:text-lime-300"
          >
            <Mail class="h-3.5 w-3.5 shrink-0 text-lime-300" aria-hidden="true" />
            <span class="truncate">{{ adminEmail }}</span>
          </a>
          <a
            :href="adminTelHref"
            class="hidden items-center gap-1.5 whitespace-nowrap text-white/90 transition hover:text-lime-300 sm:inline-flex"
          >
            <Phone class="h-3.5 w-3.5 shrink-0 text-lime-300" aria-hidden="true" />
            <span>+91 {{ adminPhoneDisplay }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Main nav under the top strip -->
    <div
      class="relative z-10 border-b transition-all duration-500"
      :class="
        solidHeader
          ? 'border-emerald-950/8 bg-white/95 text-emerald-950 shadow-[0_10px_40px_-20px_rgba(7,28,22,0.28)] backdrop-blur-xl'
          : 'border-white/10 bg-[#071c16]/70 text-white backdrop-blur-md'
      "
    >
      <nav
        class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[4.25rem] sm:px-8 lg:px-12"
        aria-label="Primary navigation"
      >
        <a
          href="/"
          class="group flex shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
          aria-label="Ideal Energy home"
          @click="handleNavigation('home')"
        >
          <BrandLogo :variant="solidHeader ? 'light' : 'invert'" size="md" />
        </a>

        <ul class="hidden items-center gap-1 lg:flex">
          <li v-for="item in navItems" :key="item.label" class="relative">
            <div
              v-if="item.label === 'Services'"
              ref="servicesMenu"
              class="relative"
              @mouseenter="servicesOpen = true"
              @mouseleave="servicesOpen = false"
              @focusout="closeServices"
              @keydown.escape.stop="servicesOpen = false"
            >
              <button
                type="button"
                class="group relative flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
                :class="
                  activeSection === item.section
                    ? solidHeader
                      ? 'text-emerald-800'
                      : 'text-lime-300'
                    : solidHeader
                      ? 'text-slate-700 hover:text-emerald-800'
                      : 'text-white/85 hover:text-white'
                "
                :aria-expanded="servicesOpen"
                aria-controls="services-mega-menu"
                @click.stop="servicesOpen = !servicesOpen"
              >
                {{ item.label }}
                <ChevronDown
                  class="h-3.5 w-3.5 transition-transform duration-300"
                  :class="{ 'rotate-180': servicesOpen }"
                  aria-hidden="true"
                />
                <span
                  class="absolute inset-x-4 -bottom-px h-0.5 origin-left scale-x-0 rounded-full bg-lime-300 transition-transform duration-300 group-hover:scale-x-100"
                  :class="{ 'scale-x-100': activeSection === item.section }"
                  aria-hidden="true"
                ></span>
              </button>

              <Transition
                enter-active-class="transition duration-250 ease-out"
                enter-from-class="-translate-y-2 scale-[0.98] opacity-0"
                enter-to-class="translate-y-0 scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 scale-100 opacity-100"
                leave-to-class="-translate-y-2 scale-[0.98] opacity-0"
              >
                <div
                  v-if="servicesOpen"
                  id="services-mega-menu"
                  class="absolute left-1/2 top-full mt-4 w-[42rem] -translate-x-1/2 overflow-hidden rounded-3xl border border-emerald-950/10 bg-white/95 p-3 text-emerald-950 shadow-2xl shadow-emerald-950/15 backdrop-blur-2xl"
                >
                  <div class="grid grid-cols-2 gap-1">
                    <RouterLink
                      v-for="service in services"
                      :key="service.label"
                      :to="service.href"
                      class="group/service flex gap-4 rounded-2xl p-4 transition duration-300 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
                      @click="handleNavigation('services'); servicesOpen = false"
                    >
                      <span
                        class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime-200 text-emerald-950 transition group-hover/service:bg-emerald-950 group-hover/service:text-lime-300"
                      >
                        <component :is="service.icon" class="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span class="text-left">
                        <span class="block text-sm font-bold">{{ service.label }}</span>
                        <span class="mt-1 block text-xs leading-5 text-slate-500">{{ service.description }}</span>
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </Transition>
            </div>

            <RouterLink
              v-else
              :to="item.href"
              class="group relative block rounded-full px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
              :class="
                activeSection === item.section
                  ? solidHeader
                    ? 'text-emerald-800'
                    : 'text-lime-300'
                  : solidHeader
                    ? 'text-slate-700 hover:text-emerald-800'
                    : 'text-white/85 hover:text-white'
              "
              @click="handleNavigation(item.section)"
            >
              {{ item.label }}
              <span
                class="absolute inset-x-4 -bottom-px h-0.5 origin-left scale-x-0 rounded-full bg-lime-300 transition-transform duration-300 group-hover:scale-x-100"
                :class="{ 'scale-x-100': activeSection === item.section }"
                aria-hidden="true"
              ></span>
            </RouterLink>
          </li>
        </ul>

        <div class="hidden items-center gap-2 lg:flex">
          <a
            :href="phoneHref"
            class="grid h-10 w-10 place-items-center rounded-full border transition duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            :class="
              solidHeader
                ? 'border-emerald-950/10 text-emerald-950 hover:bg-emerald-50'
                : 'border-white/20 text-white hover:bg-white/10'
            "
            aria-label="Call our solar advisors"
          >
            <Phone class="h-4.5 w-4.5" aria-hidden="true" />
          </a>
          <a
            :href="whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-10 w-10 place-items-center rounded-full border transition duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            :class="
              solidHeader
                ? 'border-emerald-950/10 text-emerald-950 hover:bg-emerald-50'
                : 'border-white/20 text-white hover:bg-white/10'
            "
            aria-label="Chat with us on WhatsApp"
          >
            <MessageCircle class="h-4.5 w-4.5" aria-hidden="true" />
          </a>
          <a
            :href="quoteHref"
            class="group ml-2 inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-lime-300/15 transition duration-300 hover:-translate-y-0.5 hover:bg-lime-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            @click="handleNavigation('contact')"
          >
            Get Free Quote
            <ArrowUpRight
              class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <button
          ref="menuButton"
          type="button"
          class="relative grid h-11 w-11 place-items-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 lg:hidden"
          :class="solidHeader ? 'border-emerald-950/10 text-emerald-950' : 'border-white/20 text-white'"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-drawer"
          aria-label="Open navigation menu"
          @click="openMobileMenu"
        >
          <span class="relative h-4 w-5" aria-hidden="true">
            <span
              class="absolute left-0 top-0 h-0.5 w-5 origin-center rounded-full bg-current transition duration-300"
              :class="{ 'translate-y-[7px] rotate-45': mobileOpen }"
            ></span>
            <span
              class="absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-200"
              :class="{ 'scale-x-0 opacity-0': mobileOpen }"
            ></span>
            <span
              class="absolute bottom-0 left-0 h-0.5 w-5 origin-center rounded-full bg-current transition duration-300"
              :class="{ '-translate-y-[7px] -rotate-45': mobileOpen }"
            ></span>
          </span>
        </button>
      </nav>
    </div>

    <MobileMenu
      :open="mobileOpen"
      :nav-items="navItems"
      :services="services"
      :active-section="activeSection"
      :phone-href="phoneHref"
      :whatsapp-href="whatsappHref"
      @close="closeMobileMenu"
      @navigate="handleNavigation"
    />
  </header>
</template>
