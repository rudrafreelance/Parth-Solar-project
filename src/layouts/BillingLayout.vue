<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  Settings,
  Users,
  X,
} from '@lucide/vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { useAdminAuth } from '@/composables/useAdminAuth'

const route = useRoute()
const router = useRouter()
const { session, signOut } = useAdminAuth()
const mobileNavOpen = ref(false)

const navItems = [
  { label: 'Dashboard', to: '/billing', icon: LayoutDashboard, exact: true },
  { label: 'Bills', to: '/billing/bills', icon: ReceiptText },
  { label: 'New sale', to: '/billing/bills/new/sale', icon: FilePlus2 },
  { label: 'New purchase', to: '/billing/bills/new/purchase', icon: FilePlus2 },
  { label: 'Parties', to: '/billing/parties', icon: Users },
  { label: 'Items', to: '/billing/items', icon: Package },
  { label: 'Settings', to: '/billing/settings', icon: Settings },
]

const pageTitle = computed(() => {
  if (route.path.includes('/bills/new/sale')) return 'New sale'
  if (route.path.includes('/bills/new/purchase')) return 'New purchase'
  if (route.path.includes('/edit')) return 'Edit bill'
  const match = navItems.find((item) =>
    item.exact ? route.path === item.to : route.path.startsWith(item.to),
  )
  return match?.label || 'Billing'
})

function isActive(item) {
  if (item.exact) return route.path === item.to
  if (item.to === '/billing/bills') return route.path === '/billing/bills'
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

async function handleSignOut() {
  await signOut()
  router.push('/billing/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#f3f6ef] text-emerald-950">
    <RouterView v-if="route.name === 'billing-login'" />

    <div v-else class="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside
        class="fixed inset-y-0 left-0 z-40 w-[260px] border-r border-emerald-950/10 bg-[#071c16] text-white transition-transform duration-300 lg:static lg:translate-x-0"
        :class="mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <div class="flex h-full flex-col px-5 py-6">
          <div class="flex items-center justify-between">
            <RouterLink to="/billing" class="inline-flex" @click="mobileNavOpen = false">
              <BrandLogo variant="invert" size="sm" />
            </RouterLink>
            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-full bg-white/10 lg:hidden"
              aria-label="Close billing menu"
              @click="mobileNavOpen = false"
            >
              <X class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <p class="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-lime-300/80">Billing Portal</p>
          <nav class="mt-4 space-y-1" aria-label="Billing navigation">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition"
              :class="isActive(item) ? 'bg-lime-300 text-emerald-950' : 'text-emerald-50/75 hover:bg-white/10 hover:text-white'"
              @click="mobileNavOpen = false"
            >
              <component :is="item.icon" class="h-4.5 w-4.5" aria-hidden="true" />
              {{ item.label }}
            </RouterLink>
          </nav>

          <div class="mt-auto space-y-3 border-t border-white/10 pt-5">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-emerald-50/75 transition hover:bg-white/10 hover:text-white"
              @click="handleSignOut"
            >
              <LogOut class="h-4.5 w-4.5" aria-hidden="true" />
              Sign out
            </button>
            <p v-if="session?.user?.email" class="truncate px-3 text-xs text-emerald-50/45">
              {{ session.user.email }}
            </p>
          </div>
        </div>
      </aside>

      <button
        v-if="mobileNavOpen"
        type="button"
        class="fixed inset-0 z-30 bg-emerald-950/40 backdrop-blur-sm lg:hidden"
        aria-label="Close menu overlay"
        @click="mobileNavOpen = false"
      ></button>

      <div class="min-w-0">
        <header class="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-950/10 bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-full border border-emerald-950/10 bg-white lg:hidden"
              aria-label="Open billing menu"
              @click="mobileNavOpen = true"
            >
              <Menu class="h-5 w-5" aria-hidden="true" />
            </button>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Ideal Energy</p>
              <h1 class="text-xl font-bold tracking-[-0.03em] text-emerald-950">{{ pageTitle }}</h1>
            </div>
          </div>
        </header>

        <main class="px-5 py-8 sm:px-8 lg:px-10">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
