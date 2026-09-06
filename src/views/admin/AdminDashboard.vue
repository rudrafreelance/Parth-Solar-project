<script setup>
import { onMounted, ref } from 'vue'
import { FolderKanban, MessageSquareText, Images } from '@lucide/vue'
import { useProjects } from '@/composables/useProjects'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

const { projects, fetchProjects } = useProjects()
const leadsCount = ref(0)
const loading = ref(true)

const cards = [
  { key: 'projects', label: 'Projects', to: '/admin/projects', icon: FolderKanban, tone: 'bg-lime-200 text-emerald-950' },
  { key: 'leads', label: 'New leads', to: '/admin/leads', icon: MessageSquareText, tone: 'bg-emerald-100 text-emerald-900' },
  { key: 'gallery', label: 'Public gallery', to: '/projects', icon: Images, tone: 'bg-white text-emerald-950 border border-emerald-950/10' },
]

onMounted(async () => {
  await fetchProjects({ force: true })
  if (supabase) {
    const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true })
    leadsCount.value = count || 0
  }
  loading.value = false
})

function valueFor(key) {
  if (key === 'projects') return projects.value.length
  if (key === 'leads') return leadsCount.value
  return 'Open'
}
</script>

<template>
  <div>
    <p class="text-sm text-slate-600">
      Backend panel for Ideal Energy. Public website stays separate; this area manages content and enquiries.
    </p>

    <p v-if="!isSupabaseConfigured" class="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Supabase backend is not connected yet. Add root <code>.env</code> keys and run <code>supabase/schema.sql</code>.
    </p>

    <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <RouterLink
        v-for="card in cards"
        :key="card.key"
        :to="card.to"
        class="rounded-[1.5rem] p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-950/5"
        :class="card.tone"
        :target="card.key === 'gallery' ? '_blank' : undefined"
      >
        <component :is="card.icon" class="h-6 w-6" aria-hidden="true" />
        <p class="mt-8 text-sm font-bold uppercase tracking-[0.14em] opacity-70">{{ card.label }}</p>
        <p class="mt-2 text-3xl font-bold tracking-[-0.03em]">
          {{ loading && card.key !== 'gallery' ? '…' : valueFor(card.key) }}
        </p>
      </RouterLink>
    </div>

    <section class="mt-10 rounded-[1.75rem] border border-emerald-950/10 bg-white p-6 sm:p-8">
      <h2 class="text-xl font-bold text-emerald-950">How this is split</h2>
      <div class="mt-5 grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl bg-[#f3f6ef] p-5">
          <p class="text-sm font-bold text-emerald-700">Frontend (public site)</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            Home, About, Services, Projects gallery — what visitors see on Vercel.
          </p>
        </div>
        <div class="rounded-2xl bg-[#f3f6ef] p-5">
          <p class="text-sm font-bold text-emerald-700">Backend (admin + Supabase)</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            This panel uploads photos, stores projects/leads in Supabase, and keeps secrets out of the public UI.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
