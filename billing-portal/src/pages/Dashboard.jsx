import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, FilePlus2 } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../supabaseClient'
import { formatInr } from '../lib/billingMath'
import { SkeletonRows } from '../components/Spinner'

function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const iso = (d) => d.toISOString().slice(0, 10)
  return { start: iso(start), end: iso(end) }
}

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bills, setBills] = useState([])
  const range = useMemo(() => monthRange(), [])

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      setError('')
      const { data, error: qErr } = await supabase
        .from('bills')
        .select('id, bill_type, invoice_no, invoice_date, party_name, grand_total, pdf_url')
        .eq('user_id', user.id)
        .order('invoice_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(40)
      if (!alive) return
      if (qErr) setError(qErr.message)
      else setBills(data || [])
      setLoading(false)
    }
    load()
    return () => {
      alive = false
    }
  }, [user.id])

  const monthBills = bills.filter((b) => b.invoice_date >= range.start && b.invoice_date <= range.end)
  const saleTotal = monthBills
    .filter((b) => b.bill_type === 'sale')
    .reduce((s, b) => s + Number(b.grand_total || 0), 0)
  const purchaseTotal = monthBills
    .filter((b) => b.bill_type === 'purchase')
    .reduce((s, b) => s + Number(b.grand_total || 0), 0)
  const recent = bills.slice(0, 5)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Overview</p>
          <h2 className="mt-1 text-3xl font-bold text-emerald-950">Dashboard</h2>
        </div>
        <div className="flex gap-2">
          <Link
            to="/bills/new/sale"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white"
          >
            <FilePlus2 className="h-4 w-4" /> New sale
          </Link>
          <Link
            to="/bills/new/purchase"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-950/15 bg-white px-4 py-2.5 text-sm font-bold text-emerald-950"
          >
            <FilePlus2 className="h-4 w-4" /> New purchase
          </Link>
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <SkeletonRows rows={5} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-lime-300 p-6 text-emerald-950 shadow-sm">
              <p className="text-sm font-semibold text-emerald-900/70">This month · Sales</p>
              <p className="mt-2 text-3xl font-bold">{formatInr(saleTotal)}</p>
            </div>
            <div className="rounded-3xl bg-[#071c16] p-6 text-white shadow-sm">
              <p className="text-sm font-semibold text-white/65">This month · Purchases</p>
              <p className="mt-2 text-3xl font-bold">{formatInr(purchaseTotal)}</p>
            </div>
          </div>

          <section className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-bold text-emerald-950">Recent bills</h3>
            {recent.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">No bills yet. Create a sale or purchase invoice.</p>
            ) : (
              <ul className="mt-4 divide-y divide-emerald-950/8">
                {recent.map((bill) => (
                  <li key={bill.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-semibold text-emerald-950">
                        {bill.bill_type === 'sale' ? 'Sale' : 'Purchase'} · {bill.invoice_no}
                      </p>
                      <p className="text-sm text-slate-600">
                        {bill.party_name} · {bill.invoice_date} · {formatInr(bill.grand_total)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/bills/${bill.id}/edit`}
                        className="rounded-full border border-emerald-950/15 px-3 py-1.5 text-xs font-bold text-emerald-950"
                      >
                        Edit
                      </Link>
                      {bill.pdf_url ? (
                        <a
                          href={bill.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Open PDF <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No PDF</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
