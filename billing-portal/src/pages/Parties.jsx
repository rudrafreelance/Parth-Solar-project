import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../supabaseClient'
import { SkeletonRows } from '../components/Spinner'

const blank = {
  party_type: 'customer',
  name: '',
  gstin: '',
  address: '',
  phone: '',
  email: '',
  state_name: 'Gujarat',
  state_code: '24',
}

export default function Parties() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const { data, error: qErr } = await supabase
      .from('parties')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    if (qErr) setError(qErr.message)
    else setRows(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  function startEdit(row) {
    setEditingId(row.id)
    setForm({
      party_type: row.party_type,
      name: row.name,
      gstin: row.gstin,
      address: row.address,
      phone: row.phone,
      email: row.email,
      state_name: row.state_name,
      state_code: row.state_code,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(blank)
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    setSaving(true)
    setError('')
    const payload = { ...form, name: form.name.trim(), user_id: user.id }
    const query = editingId
      ? supabase.from('parties').update(payload).eq('id', editingId).eq('user_id', user.id)
      : supabase.from('parties').insert(payload)
    const { error: saveErr } = await query
    setSaving(false)
    if (saveErr) {
      setError(saveErr.message)
      return
    }
    resetForm()
    load()
  }

  async function onDelete(row) {
    if (!window.confirm(`Delete party “${row.name}”?`)) return
    const { error: delErr } = await supabase.from('parties').delete().eq('id', row.id).eq('user_id', user.id)
    if (delErr) setError(delErr.message)
    else load()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Master data</p>
        <h2 className="mt-1 text-3xl font-bold text-emerald-950">Parties</h2>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={onSubmit} className="grid gap-3 rounded-3xl border border-emerald-950/10 bg-white p-5 sm:grid-cols-2">
        <h3 className="sm:col-span-2 text-lg font-bold text-emerald-950">
          {editingId ? 'Edit party' : 'Add party'}
        </h3>
        <label className="text-sm font-bold text-emerald-950">
          Type
          <select
            value={form.party_type}
            onChange={(e) => setForm((f) => ({ ...f, party_type: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          >
            <option value="customer">Customer (sale)</option>
            <option value="supplier">Supplier (purchase)</option>
          </select>
        </label>
        <label className="text-sm font-bold text-emerald-950">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-bold text-emerald-950">
          GSTIN
          <input
            value={form.gstin}
            onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-bold text-emerald-950">
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-bold text-emerald-950 sm:col-span-2">
          Address
          <textarea
            rows={2}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-emerald-950/15 px-4 py-2.5 text-sm font-bold text-emerald-950"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white">
        {loading ? (
          <div className="p-5">
            <SkeletonRows />
          </div>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-600">No parties yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-emerald-950/5">
                <tr>
                  <th className="px-4 py-3 font-bold">Type</th>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">GSTIN</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer border-t border-emerald-950/8 hover:bg-emerald-50/50"
                    onClick={() => startEdit(row)}
                  >
                    <td className="px-4 py-3 capitalize">{row.party_type}</td>
                    <td className="px-4 py-3 font-semibold">{row.name}</td>
                    <td className="px-4 py-3">{row.gstin || '—'}</td>
                    <td className="px-4 py-3">{row.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => startEdit(row)} className="rounded-lg border p-2">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => onDelete(row)} className="rounded-lg border border-red-200 p-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
