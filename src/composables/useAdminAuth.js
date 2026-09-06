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

    const cleanEmail = String(email || '').trim().toLowerCase()
    const cleanPassword = String(password || '')

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    })
    if (error) {
      const msg = error.message || 'Login failed'
      if (/email not confirmed/i.test(msg) || error.code === 'email_not_confirmed') {
        authError.value =
          'Email is not confirmed. In Supabase → Authentication → Users, open this user and confirm the email (or disable “Confirm email” in Auth settings).'
      } else if (/invalid login credentials/i.test(msg)) {
        authError.value =
          'Invalid login credentials. Check email/password, that the user exists in this Supabase project, and that root .env uses this project’s anon/publishable key. Then restart npm run dev.'
      } else {
        authError.value = msg
      }
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
