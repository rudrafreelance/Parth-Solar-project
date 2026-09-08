import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../supabaseClient'
import Spinner from '../components/Spinner'

const defaults = {
  business_name: 'IDEAL ENERGY',
  address: 'B/4/41 VAIKUTH CO OP HOU SOC LTD, NR.CADILA BRIDEG GHODASAR AHMEDABAD',
  phone: '+91 6355859771',
  email: 'Idealeneergy@gmail.com',
  gstin: '24JMFPK6119C1Z8',
  pan: 'JMFPK6119C',
  bank_name: 'INDUSIND BANK',
  bank_account_name: 'IDEAL ENERGY',
  bank_account_no: '251010190313',
  bank_ifsc: 'INDB0000727',
  state_name: 'Gujarat',
  state_code: '24',
}

export default function Settings() {
  const { user } = useAuth()
  const [form, setForm] = useState(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      const { data, error: qErr } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      if (!alive) return
      if (qErr) setError(qErr.message)
      else if (data) setForm({ ...defaults, ...data })
      setLoading(false)
    }
    load()
    return () => {
      alive = false
    }
  }, [user.id])

  async function onSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const payload = {
      user_id: user.id,
      business_name: form.business_name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      gstin: form.gstin.trim(),
      pan: form.pan.trim(),
      bank_name: form.bank_name.trim(),
      bank_account_name: form.bank_account_name.trim(),
      bank_account_no: form.bank_account_no.trim(),
      bank_ifsc: form.bank_ifsc.trim(),
      state_name: form.state_name.trim(),
      state_code: form.state_code.trim(),
      updated_at: new Date().toISOString(),
    }
    const { error: saveErr } = await supabase.from('company_settings').upsert(payload, { onConflict: 'user_id' })
    setSaving(false)
    if (saveErr) setError(saveErr.message)
    else setMessage('Company profile saved.')
  }

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Spinner label="Loading settings…" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Company</p>
        <h2 className="mt-1 text-3xl font-bold text-emerald-950">Settings</h2>
        <p className="mt-2 text-sm text-slate-600">These details print on Ideal Energy sale invoices.</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}

      <form onSubmit={onSubmit} className="grid gap-3 rounded-3xl border border-emerald-950/10 bg-white p-5 sm:grid-cols-2">
        {[
          ['business_name', 'Business name'],
          ['phone', 'Phone'],
          ['email', 'Email'],
          ['gstin', 'GSTIN'],
          ['pan', 'PAN'],
          ['bank_account_name', 'Bank account name'],
          ['bank_account_no', 'Account number'],
          ['bank_name', 'Bank name'],
          ['bank_ifsc', 'IFSC'],
          ['state_name', 'State'],
          ['state_code', 'State code'],
        ].map(([key, label]) => (
          <label key={key} className="text-sm font-bold text-emerald-950">
            {label}
            <input
              value={form[key] || ''}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
            />
          </label>
        ))}
        <label className="text-sm font-bold text-emerald-950 sm:col-span-2">
          Address
          <textarea
            rows={3}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60 sm:col-span-2"
        >
          {saving ? 'Saving…' : 'Save company profile'}
        </button>
      </form>
    </div>
  )
}
