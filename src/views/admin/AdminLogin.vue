<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = useRouter()
const route = useRoute()
const { signIn, authError, isSupabaseConfigured } = useAdminAuth()
const loading = ref(false)

const credentials = reactive({
  email: '',
  password: '',
})

async function handleSubmit() {
  loading.value = true
  const ok = await signIn(credentials.email, credentials.password)
  loading.value = false
  if (!ok) return
  router.replace((route.query.redirect && String(route.query.redirect)) || '/admin')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[#071c16] px-5 py-10">
    <div class="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl sm:p-9">
      <BrandLogo variant="light" size="md" />
      <h1 class="mt-7 text-3xl font-bold tracking-[-0.03em] text-emerald-950">Admin login</h1>
      <p class="mt-2 text-sm leading-6 text-slate-600">
        Separate backend panel for Ideal Energy. Manage projects, leads, and site content.
      </p>

      <p v-if="!isSupabaseConfigured" class="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
        Root <code>.env</code> keys are missing. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
      </p>
      <p v-else-if="authError" class="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ authError }}
      </p>

      <form class="mt-7 grid gap-4" @submit.prevent="handleSubmit">
        <label class="block text-left">
          <span class="text-sm font-bold text-emerald-950">Email</span>
          <input
            v-model="credentials.email"
            type="email"
            required
            autocomplete="username"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            placeholder="admin@idealenergy.in"
          />
        </label>
        <label class="block text-left">
          <span class="text-sm font-bold text-emerald-950">Password</span>
          <input
            v-model="credentials.password"
            type="password"
            required
            autocomplete="current-password"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          class="rounded-full bg-emerald-950 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Signing in…' : 'Enter admin panel' }}
        </button>
      </form>
    </div>
  </div>
</template>
