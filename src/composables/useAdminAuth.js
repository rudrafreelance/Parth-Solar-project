import { computed, ref } from 'vue'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

const session = ref(null)
const authReady = ref(false)
const authError = ref('')
let listenerBound = false

async function initAuth() {
  if (!supabase) {
    authReady.value = true
    return
  }

  const { data } = await supabase.auth.getSession()
  session.value = data.session
  authReady.value = true

  if (!listenerBound) {
    listenerBound = true
    supabase.auth.onAuthStateChange((_event, nextSession) => {
      session.value = nextSession
    })
  }
}

export function useAdminAuth() {
  const isAuthenticated = computed(() => Boolean(session.value))

  async function signIn(email, password) {
    authError.value = ''

    if (!isSupabaseConfigured || !supabase) {
      authError.value = 'Supabase is not configured. Add keys to the root .env file.'
      return false
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      authError.value = error.message
      return false
    }

    await initAuth()
    return true
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    session.value = null
  }

  return {
    session,
    authReady,
    authError,
    isAuthenticated,
    isSupabaseConfigured,
    initAuth,
    signIn,
    signOut,
  }
}
