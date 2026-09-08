import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Search } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../supabaseClient'
import { financialYearForDate, formatInr, listFinancialYears } from '../lib/billingMath'
import { SkeletonRows } from '../components/Spinner'

export default function BillList() {
  const { user } = useAuth()
  const years = useMemo(() => listFinancialYears(6), [])
  const [fy, setFy] = useState(financialYearForDate(new Date()))
  const [type, setType] = useState('all')
  const [q, setQ] = useState('')
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      setError('')
      let query = supabase
        .from('bills')
        .select('id, bill_type, invoice_no, invoice_date, party_name, grand_total, pdf_url, financial_year')
        .eq('user_id', user.id)
        .eq('financial_year', fy)
        .order('invoice_date', { ascending: false })

      if (type !== 'all') query = query.eq('bill_type', type)

      const { data, error: qErr } = await query
      if (!alive) return
      if (qErr) setError(qErr.message)
      else setBills(data || [])
      setLoading(false)
    }
    load()
    return () => {
      alive = false
    }
  }, [user.id, fy, type])

  const filtered = bills.filter((b) => {
    const hay = `${b.party_name} ${b.invoice_no}`.toLowerCase()
    return hay.includes(q.trim().toLowerCase())
  })

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Invoices</p>
          <h2 className="mt-1 text-3xl font-bold text-emerald-950">Bills</h2>
        </div>
        <div className="flex gap-2">
          <Link to="/bills/new/sale" className="rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white">
            New sale
          </Link>
          <Link
            to="/bills/new/purchase"
            className="rounded-full border border-emerald-950/15 bg-white px-4 py-2.5 text-sm font-bold text-emerald-950"
          >
            New purchase
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-3xl border border-emerald-950/10 bg-white p-4">
        <label className="text-sm font-semibold text-emerald-950">
          FY
          <select
            value={fy}
            onChange={(e) => setFy(e.target.value)}
            className="ml-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-emerald-950">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="ml-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <option value="all">All</option>
            <option value="sale">Sale</option>
            <option value="purchase">Purchase</option>
          </select>
        </label>
        <label className="relative min-w-[220px] flex-1 text-sm font-semibold text-emerald-950">
          Search party / invoice
          <span className="relative mt-1 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3"
              placeholder="RK ENTERPRISE / 0003"
            />
          </span>
        </label>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white">
        {loading ? (
          <div className="p-5">
            <SkeletonRows />
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-600">No bills in this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-emerald-950/5 text-emerald-900">
                <tr>
                  <th className="px-4 py-3 font-bold">Type</th>
                  <th className="px-4 py-3 font-bold">Invoice</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Party</th>
                  <th className="px-4 py-3 font-bold">Total</th>
                  <th className="px-4 py-3 font-bold">PDF</th>
                  <th className="px-4 py-3 font-bold" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((bill) => (
                  <tr key={bill.id} className="border-t border-emerald-950/8">
                    <td className="px-4 py-3 capitalize">{bill.bill_type}</td>
                    <td className="px-4 py-3 font-semibold">{bill.invoice_no}</td>
                    <td className="px-4 py-3">{bill.invoice_date}</td>
                    <td className="px-4 py-3">{bill.party_name}</td>
                    <td className="px-4 py-3">{formatInr(bill.grand_total)}</td>
                    <td className="px-4 py-3">
                      {bill.pdf_url ? (
                        <a
                          href={bill.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:underline"
                        >
                          Open PDF <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/bills/${bill.id}/edit`} className="font-semibold text-emerald-800 hover:underline">
                        Edit
                      </Link>
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
