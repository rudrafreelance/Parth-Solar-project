<script setup>
import { ref } from 'vue'
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from '@lucide/vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'

defineProps({
  brand: {
    type: String,
    default: 'Ideal Energy',
  },
  description: {
    type: String,
    default:
      'Thoughtfully engineered solar solutions that make clean, reliable energy simple for homes and businesses.',
  },
  quickLinks: {
    type: Array,
    default: () => [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
      { label: 'Services', to: '/services' },
      { label: 'Projects', to: '/projects' },
      { label: 'Calculator', to: '/calculator' },
      { label: 'Our Process', to: '/#process' },
      { label: 'Contact', to: '/#contact' },
    ],
  },
  services: {
    type: Array,
    default: () => [
      { label: 'Residential Solar', to: '/services' },
      { label: 'Commercial Solar', to: '/services' },
      { label: 'Industrial Solar', to: '/services' },
      { label: 'Battery Storage', to: '/services' },
      { label: 'Maintenance', to: '/services' },
      { label: 'Government Subsidy', to: '/services' },
    ],
  },
  contact: {
    type: Object,
    default: () => ({
      phone: '80030 80020',
      phoneHref: 'tel:+918003080020',
      email: 'hello@idealenergy.in',
      emailHref: 'mailto:hello@idealenergy.in',
      address: 'Ahmedabad, Gujarat, India',
      mapHref: 'https://maps.google.com/?q=Ahmedabad+Gujarat+India',
      whatsappHref: 'https://wa.me/918003080020',
    }),
  },
  socialLinks: {
    type: Array,
    default: () => [
      { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
      { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
      { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
      { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
    ],
  },
})

const emit = defineEmits(['subscribe'])
const email = ref('')

const linkClass =
  'group inline-flex items-center text-sm text-emerald-50/60 transition hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300'

function subscribe() {
  emit('subscribe', email.value)
  email.value = ''
}
</script>

<template>
  <footer class="relative overflow-hidden bg-[#061a14] text-white">
    <div class="pointer-events-none absolute -right-40 -top-48 h-[30rem] w-[30rem] rounded-full border-[80px] border-lime-300/[0.035]" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-emerald-500/[0.04] blur-3xl" aria-hidden="true"></div>

    <div class="relative mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
      <div class="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_.75fr_.85fr_1.05fr] lg:gap-10 lg:pb-18">
        <div data-aos="fade-up" class="max-w-md">
          <RouterLink
            to="/"
            class="inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
            aria-label="Ideal Energy home"
          >
            <BrandLogo variant="invert" size="lg" />
          </RouterLink>

          <p class="mt-6 max-w-sm text-sm leading-7 text-emerald-50/60">
            {{ description }}
          </p>

          <div class="mt-7 flex items-center gap-2.5">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-emerald-50/70 transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-lime-300 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
              :aria-label="`Follow us on ${social.label}`"
            >
              <svg
                v-if="social.icon === 'instagram'"
                class="h-4.5 w-4.5"
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
              <svg
                v-else-if="social.icon === 'linkedin'"
                class="h-4.5 w-4.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.5 8.25H3V21h3.5V8.25ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.7c0-3.84-2.05-5.63-4.78-5.63-2.2 0-3.19 1.21-3.74 2.06V8.25H9V21h3.48v-6.32c0-1.67.32-3.3 2.4-3.3 2.05 0 2.08 1.92 2.08 3.41V21H21v-7.3Z"></path>
              </svg>
              <svg
                v-else-if="social.icon === 'facebook'"
                class="h-4.5 w-4.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M14 21v-8h2.8l.42-3H14V8.08c0-.87.25-1.46 1.6-1.46h1.7V3.94c-.3-.04-1.3-.13-2.48-.13-2.46 0-4.15 1.5-4.15 4.27V10H8v3h2.67v8H14Z"></path>
              </svg>
              <svg
                v-else
                class="h-4.5 w-4.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.93 4.78 12 4.78 12 4.78s-5.93 0-7.64.46a2.75 2.75 0 0 0-1.94 1.95A28.65 28.65 0 0 0 1.96 12c0 1.62.15 3.23.46 4.81a2.75 2.75 0 0 0 1.94 1.95c1.71.46 7.64.46 7.64.46s5.93 0 7.64-.46a2.75 2.75 0 0 0 1.94-1.95c.31-1.58.46-3.19.46-4.81 0-1.62-.15-3.23-.46-4.81ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z"></path>
              </svg>
            </a>
          </div>

          <div class="mt-9">
            <p class="text-sm font-bold text-white">Bright ideas, delivered monthly.</p>
            <form class="mt-3 flex max-w-sm rounded-full border border-white/10 bg-white/[0.06] p-1.5 focus-within:border-lime-300/50" @submit.prevent="subscribe">
              <label for="footer-email" class="sr-only">Email address</label>
              <input
                id="footer-email"
                v-model="email"
                type="email"
                name="email"
                autocomplete="email"
                required
                placeholder="Your email address"
                class="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/35"
              />
              <button
                type="submit"
                class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime-300 text-emerald-950 transition duration-300 hover:scale-105 hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
                aria-label="Subscribe to our newsletter"
              >
                <ArrowRight class="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="80">
          <h2 class="text-sm font-bold uppercase tracking-[0.14em] text-lime-300">Quick Links</h2>
          <ul class="mt-6 space-y-3.5">
            <li v-for="link in quickLinks" :key="link.label">
              <RouterLink :to="link.to" :class="linkClass">
                <span class="mr-0 h-px w-0 bg-lime-300 transition-all duration-300 group-hover:mr-2 group-hover:w-4" aria-hidden="true"></span>
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div data-aos="fade-up" data-aos-delay="160">
          <h2 class="text-sm font-bold uppercase tracking-[0.14em] text-lime-300">Services</h2>
          <ul class="mt-6 space-y-3.5">
            <li v-for="service in services" :key="service.label">
              <RouterLink :to="service.to" :class="linkClass">
                <span class="mr-0 h-px w-0 bg-lime-300 transition-all duration-300 group-hover:mr-2 group-hover:w-4" aria-hidden="true"></span>
                {{ service.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div data-aos="fade-up" data-aos-delay="240">
          <h2 class="text-sm font-bold uppercase tracking-[0.14em] text-lime-300">Contact</h2>
          <address class="mt-6 space-y-5 not-italic">
            <a
              :href="contact.phoneHref"
              class="group flex items-start gap-3 text-sm text-emerald-50/60 transition hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
            >
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-lime-300 transition group-hover:bg-lime-300 group-hover:text-emerald-950">
                <Phone class="h-4 w-4" aria-hidden="true" />
              </span>
              <span class="pt-2">{{ contact.phone }}</span>
            </a>

            <a
              :href="contact.emailHref"
              class="group flex items-start gap-3 text-sm text-emerald-50/60 transition hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
            >
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-lime-300 transition group-hover:bg-lime-300 group-hover:text-emerald-950">
                <Mail class="h-4 w-4" aria-hidden="true" />
              </span>
              <span class="pt-2">{{ contact.email }}</span>
            </a>

            <a
              :href="contact.mapHref"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-start gap-3 text-sm leading-6 text-emerald-50/60 transition hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
            >
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-lime-300 transition group-hover:bg-lime-300 group-hover:text-emerald-950">
                <MapPin class="h-4 w-4" aria-hidden="true" />
              </span>
              <span class="pt-1.5">{{ contact.address }}</span>
            </a>

            <a
              :href="contact.whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/10 px-4 py-2.5 text-sm font-bold text-lime-300 transition hover:border-lime-300 hover:bg-lime-300 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              <MessageCircle class="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </address>
        </div>
      </div>

      <div class="flex flex-col gap-5 pt-7 text-xs text-emerald-50/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ new Date().getFullYear() }} {{ brand }}. All rights reserved.</p>
        <nav class="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
          <RouterLink
            to="/privacy"
            class="transition hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
          >
            Privacy Policy
          </RouterLink>
          <RouterLink
            to="/terms"
            class="transition hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
          >
            Terms & Conditions
          </RouterLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
