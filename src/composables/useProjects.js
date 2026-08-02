import { ref } from 'vue'
import { fallbackProjects } from '@/data/fallbackProjects'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

const projects = ref([])
const loading = ref(false)
const error = ref('')
let loadedOnce = false

function sortProjects(list) {
  return [...list].sort((a, b) => {
    if (Boolean(b.featured) !== Boolean(a.featured)) return Number(b.featured) - Number(a.featured)
    if ((a.sort_order ?? 0) !== (b.sort_order ?? 0)) return (a.sort_order ?? 0) - (b.sort_order ?? 0)
    return new Date(b.created_at || 0) - new Date(a.created_at || 0)
  })
}

export function useProjects() {
  async function fetchProjects({ force = false } = {}) {
    if (loadedOnce && !force && projects.value.length) return projects.value

    loading.value = true
    error.value = ''

    try {
      if (!isSupabaseConfigured || !supabase) {
        projects.value = sortProjects(fallbackProjects)
        loadedOnce = true
        return projects.value
      }

      const { data, error: queryError } = await supabase
        .from('projects')
        .select('*')
        .order('featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (queryError) throw queryError

      projects.value = data?.length ? sortProjects(data) : sortProjects(fallbackProjects)
      loadedOnce = true
      return projects.value
    } catch (err) {
      error.value = err.message || 'Failed to load projects'
      projects.value = sortProjects(fallbackProjects)
      loadedOnce = true
      return projects.value
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    isSupabaseConfigured,
  }
}
