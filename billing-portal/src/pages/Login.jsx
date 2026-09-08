import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Spinner from '../components/Spinner'

export default function Login() {
  const { session, loading, signIn, isSupabaseConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner />
      </div>
    )
  }

  if (session) {
    return <Navigate to={location.state?.from || '/'} replace />
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#071c16] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Ideal Energy</p>
        <h1 className="mt-2 text-3xl font-bold text-emerald-950">Billing login</h1>
        <p className="mt-2 text-sm text-slate-600">Sale & purchase invoices for your solar business.</p>

        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to{' '}
            <code>billing-portal/.env</code>.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <label className="mt-6 block text-sm font-bold text-emerald-950">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600"
            placeholder="idealeneergy@gmail.com"
          />
        </label>

        <label className="mt-4 block text-sm font-bold text-emerald-950">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600"
          />
        </label>

        <button
          type="submit"
          disabled={submitting || !isSupabaseConfigured}
          className="mt-6 w-full rounded-full bg-emerald-950 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Enter billing portal'}
        </button>
      </form>
    </div>
  )
}
