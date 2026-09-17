import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../supabaseClient'
import { calcBillTotals, calcLine, financialYearForDate } from '../lib/billingMath'
import { generateAndUploadBillPdf } from '../lib/pdfUpload'
import { buildWhatsAppLink } from '../lib/whatsapp'
import Spinner from '../components/Spinner'

const emptyLine = () => ({
  item_id: '',
  description: '',
  hsn: '',
  qty: 1,
  unit: 'NOS',
  rate: 0,
  gst_rate: 18,
  amount: 0,
  cgst_rate: 9,
  sgst_rate: 9,
  cgst_amount: 0,
  sgst_amount: 0,
})

function applyLineMath(line) {
  const m = calcLine(line.qty, line.rate, line.gst_rate)
  return { ...line, ...m }
}

export default function BillForm() {
  const { type, id } = useParams()
  const isEdit = Boolean(id)
  const billType = isEdit ? null : type === 'purchase' ? 'purchase' : 'sale'
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [parties, setParties] = useState([])
  const [items, setItems] = useState([])
  const [company, setCompany] = useState(null)
  const [existingPath, setExistingPath] = useState('')
  const [existingId, setExistingId] = useState(id || '')
  const [pdfUrl, setPdfUrl] = useState('')
  const [billSaved, setBillSaved] = useState(false)

  const [form, setForm] = useState({
    bill_type: billType || 'sale',
    invoice_no: '',
    invoice_date: new Date().toISOString().slice(0, 10),
    party_id: '',
    party_name: '',
    party_gstin: '',
    party_address: '',
    party_phone: '',
    party_state_name: 'Gujarat',
    party_state_code: '24',
    irn: '',
    ack_no: '',
    ack_date: '',
    eway_bill_no: '',
    vehicle_no: '',
    notes: '',
  })
  const [lines, setLines] = useState([applyLineMath(emptyLine())])

  useEffect(() => {
    let alive = true
    async function boot() {
      setLoading(true)
      setError('')
      const partyType = (billType || 'sale') === 'purchase' ? 'supplier' : 'customer'

      const [partyRes, itemRes, companyRes] = await Promise.all([
        supabase.from('parties').select('*').eq('user_id', user.id).order('name'),
        supabase.from('items').select('*').eq('user_id', user.id).order('name'),
        supabase.from('company_settings').select('*').eq('user_id', user.id).maybeSingle(),
      ])

      if (!alive) return
      if (partyRes.error || itemRes.error) {
        setError(partyRes.error?.message || itemRes.error?.message)
        setLoading(false)
        return
      }

      setParties((partyRes.data || []).filter((p) => (isEdit ? true : p.party_type === partyType)))
      setItems(itemRes.data || [])
      setCompany(
        companyRes.data || {
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
        },
      )

      if (isEdit) {
        const { data: bill, error: billErr } = await supabase
          .from('bills')
          .select('*, bill_items(*)')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()
        if (!alive) return
        if (billErr) {
          setError(billErr.message)
          setLoading(false)
          return
        }
        setExistingId(bill.id)
        setExistingPath(bill.pdf_path || '')
        setForm({
          bill_type: bill.bill_type,
          invoice_no: bill.invoice_no,
          invoice_date: bill.invoice_date,
          party_id: bill.party_id || '',
          party_name: bill.party_name,
          party_gstin: bill.party_gstin,
          party_address: bill.party_address,
          party_phone: bill.party_phone,
          party_state_name: bill.party_state_name,
          party_state_code: bill.party_state_code,
          irn: bill.irn || '',
          ack_no: bill.ack_no || '',
          ack_date: bill.ack_date || '',
          eway_bill_no: bill.eway_bill_no || '',
          vehicle_no: bill.vehicle_no || '',
          notes: bill.notes || '',
        })
        const loaded = (bill.bill_items || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((row) =>
            applyLineMath({
              item_id: row.item_id || '',
              description: row.description,
              hsn: row.hsn,
              qty: row.qty,
              unit: row.unit,
              rate: row.rate,
              gst_rate: row.gst_rate,
            }),
          )
        setLines(loaded.length ? loaded : [applyLineMath(emptyLine())])
        setParties(partyRes.data || [])
      } else if (billType === 'sale') {
        const { data: nextNo, error: nextErr } = await supabase.rpc('next_sale_invoice_no', {
          p_user_id: user.id,
          p_date: form.invoice_date,
        })
        if (!alive) return
        if (nextErr) setError(nextErr.message)
        else setForm((f) => ({ ...f, invoice_no: nextNo }))
      }

      setLoading(false)
    }
    boot()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, id, billType, isEdit])

  const totals = useMemo(() => calcBillTotals(lines), [lines])

  function updateLine(index, patch) {
    setLines((prev) => prev.map((line, i) => (i === index ? applyLineMath({ ...line, ...patch }) : line)))
  }

  function pickParty(partyId) {
    const party = parties.find((p) => p.id === partyId)
    if (!party) {
      setForm((f) => ({ ...f, party_id: '' }))
      return
    }
    setForm((f) => ({
      ...f,
      party_id: party.id,
      party_name: party.name,
      party_gstin: party.gstin,
      party_address: party.address,
      party_phone: party.phone,
      party_state_name: party.state_name,
      party_state_code: party.state_code,
    }))
  }

  function pickItem(index, itemId) {
    const item = items.find((i) => i.id === itemId)
    if (!item) {
      updateLine(index, { item_id: '' })
      return
    }
    updateLine(index, {
      item_id: item.id,
      description: item.name,
      hsn: item.hsn,
      unit: item.unit,
      rate: item.default_rate,
      gst_rate: item.default_gst_rate,
    })
  }

  function validate() {
    const errs = {}
    if (!form.party_name.trim()) errs.party = 'Select or enter a party'
    if (!form.invoice_no.trim()) errs.invoice_no = 'Invoice number is required'
    if (!form.invoice_date) errs.invoice_date = 'Date is required'
    const validLines = lines.filter((l) => l.description.trim() && Number(l.qty) > 0 && Number(l.rate) > 0)
    if (!validLines.length) errs.lines = 'Add at least one line with description, qty and rate > 0'
    setFieldErrors(errs)
    return { ok: Object.keys(errs).length === 0, validLines }
  }

  async function ensureCompanyRow() {
    if (company?.id) return company
    const payload = {
      user_id: user.id,
      business_name: company.business_name,
      address: company.address,
      phone: company.phone,
      email: company.email,
      gstin: company.gstin,
      pan: company.pan,
      bank_name: company.bank_name,
      bank_account_name: company.bank_account_name,
      bank_account_no: company.bank_account_no,
      bank_ifsc: company.bank_ifsc,
      state_name: company.state_name,
      state_code: company.state_code,
    }
    const { data, error: upsertErr } = await supabase
      .from('company_settings')
      .upsert(payload, { onConflict: 'user_id' })
      .select('*')
      .single()
    if (upsertErr) throw upsertErr
    setCompany(data)
    return data
  }

  async function onSave(generatePdf) {
    setError('')
    const { ok, validLines } = validate()
    if (!ok) return

    setSaving(true)
    try {
      const companyRow = await ensureCompanyRow()
      const fy = financialYearForDate(form.invoice_date)
      const totalsNow = calcBillTotals(validLines)

      const billPayload = {
        user_id: user.id,
        bill_type: form.bill_type,
        invoice_no: form.invoice_no.trim(),
        invoice_date: form.invoice_date,
        party_id: form.party_id || null,
        party_name: form.party_name.trim(),
        party_gstin: form.party_gstin.trim(),
        party_address: form.party_address.trim(),
        party_phone: form.party_phone.trim(),
        party_state_name: form.party_state_name,
        party_state_code: form.party_state_code,
        taxable_total: totalsNow.taxable_total,
        cgst_total: totalsNow.cgst_total,
        sgst_total: totalsNow.sgst_total,
        round_off: totalsNow.round_off,
        grand_total: totalsNow.grand_total,
        amount_in_words: totalsNow.amount_in_words,
        irn: form.irn,
        ack_no: form.ack_no,
        ack_date: form.ack_date || null,
        eway_bill_no: form.eway_bill_no,
        vehicle_no: form.vehicle_no,
        notes: form.notes,
        financial_year: fy,
        updated_at: new Date().toISOString(),
      }

      let billId = existingId
      if (isEdit || existingId) {
        const { error: upErr } = await supabase.from('bills').update(billPayload).eq('id', billId).eq('user_id', user.id)
        if (upErr) throw upErr
        const { error: delErr } = await supabase.from('bill_items').delete().eq('bill_id', billId)
        if (delErr) throw delErr
      } else {
        const { data: created, error: insErr } = await supabase
          .from('bills')
          .insert(billPayload)
          .select('id')
          .single()
        if (insErr) throw insErr
        billId = created.id
        setExistingId(billId)
      }

      const itemRows = validLines.map((line, index) => ({
        bill_id: billId,
        item_id: line.item_id || null,
        description: line.description.trim(),
        hsn: line.hsn,
        qty: Number(line.qty),
        unit: line.unit,
        rate: Number(line.rate),
        amount: Number(line.amount),
        gst_rate: Number(line.gst_rate),
        cgst_rate: Number(line.cgst_rate),
        sgst_rate: Number(line.sgst_rate),
        cgst_amount: Number(line.cgst_amount),
        sgst_amount: Number(line.sgst_amount),
        sort_order: index,
      }))
      const { error: itemsErr } = await supabase.from('bill_items').insert(itemRows)
      if (itemsErr) throw itemsErr

      if (generatePdf) {
        const billForPdf = { ...billPayload, id: billId }
        const uploaded = await generateAndUploadBillPdf({
          userId: user.id,
          company: companyRow,
          bill: billForPdf,
          lines: itemRows,
          existingPath: existingPath || undefined,
        })
        setExistingPath(uploaded.pdf_path)
        setPdfUrl(uploaded.pdf_url)
        const { error: pdfErr } = await supabase
          .from('bills')
          .update({ pdf_url: uploaded.pdf_url, pdf_path: uploaded.pdf_path })
          .eq('id', billId)
        if (pdfErr) throw pdfErr
        // Open PDF in new tab so user can verify / download
        window.open(uploaded.pdf_url, '_blank', 'noopener,noreferrer')
        // Stay on page so user can share via WhatsApp with the PDF link
        setBillSaved(true)
      } else {
        setBillSaved(true)
        navigate('/bills')
      }
    } catch (err) {
      setError(err.message || 'Could not save bill')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner label="Loading bill form…" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            {form.bill_type === 'sale' ? 'Sale invoice' : 'Purchase invoice'}
          </p>
          <h2 className="mt-1 text-3xl font-bold text-emerald-950">{isEdit ? 'Edit bill' : 'Create bill'}</h2>
        </div>
        <Link to="/bills" className="text-sm font-semibold text-emerald-800 hover:underline">
          Back to list
        </Link>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 rounded-3xl border border-emerald-950/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-bold text-emerald-950">
          Invoice no.
          <input
            value={form.invoice_no}
            onChange={(e) => setForm((f) => ({ ...f, invoice_no: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
          {fieldErrors.invoice_no && <span className="mt-1 block text-xs text-red-600">{fieldErrors.invoice_no}</span>}
        </label>
        <label className="text-sm font-bold text-emerald-950">
          Invoice date
          <input
            type="date"
            value={form.invoice_date}
            onChange={(e) => setForm((f) => ({ ...f, invoice_date: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-bold text-emerald-950">
          Party
          <select
            value={form.party_id}
            onChange={(e) => pickParty(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          >
            <option value="">Select party</option>
            {parties
              .filter((p) => p.party_type === (form.bill_type === 'purchase' ? 'supplier' : 'customer'))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
          {fieldErrors.party && <span className="mt-1 block text-xs text-red-600">{fieldErrors.party}</span>}
        </label>
        <label className="text-sm font-bold text-emerald-950 sm:col-span-2">
          Party name
          <input
            value={form.party_name}
            onChange={(e) => setForm((f) => ({ ...f, party_name: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-bold text-emerald-950">
          Party GSTIN
          <input
            value={form.party_gstin}
            onChange={(e) => setForm((f) => ({ ...f, party_gstin: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-bold text-emerald-950 sm:col-span-2 lg:col-span-3">
          Party address
          <textarea
            rows={2}
            value={form.party_address}
            onChange={(e) => setForm((f) => ({ ...f, party_address: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>

        {form.bill_type === 'purchase' && (
          <>
            <label className="text-sm font-bold text-emerald-950">
              IRN
              <input
                value={form.irn}
                onChange={(e) => setForm((f) => ({ ...f, irn: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
              />
            </label>
            <label className="text-sm font-bold text-emerald-950">
              Ack No.
              <input
                value={form.ack_no}
                onChange={(e) => setForm((f) => ({ ...f, ack_no: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
              />
            </label>
            <label className="text-sm font-bold text-emerald-950">
              Ack date
              <input
                type="date"
                value={form.ack_date || ''}
                onChange={(e) => setForm((f) => ({ ...f, ack_date: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
              />
            </label>
          </>
        )}

        <label className="text-sm font-bold text-emerald-950">
          E-way bill
          <input
            value={form.eway_bill_no}
            onChange={(e) => setForm((f) => ({ ...f, eway_bill_no: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-bold text-emerald-950">
          Vehicle no.
          <input
            value={form.vehicle_no}
            onChange={(e) => setForm((f) => ({ ...f, vehicle_no: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </label>
      </div>

      <div className="rounded-3xl border border-emerald-950/10 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-emerald-950">Line items</h3>
          <button
            type="button"
            onClick={() => setLines((prev) => [...prev, applyLineMath(emptyLine())])}
            className="inline-flex items-center gap-1 rounded-full bg-lime-300 px-3 py-1.5 text-xs font-bold text-emerald-950"
          >
            <Plus className="h-3.5 w-3.5" /> Add line
          </button>
        </div>
        {fieldErrors.lines && <p className="mt-2 text-xs text-red-600">{fieldErrors.lines}</p>}

        <div className="mt-4 space-y-4">
          {lines.map((line, index) => (
            <div key={index} className="grid gap-2 rounded-2xl bg-[#f3f6ef] p-3 sm:grid-cols-6">
              <label className="text-xs font-bold text-emerald-950 sm:col-span-2">
                Catalog item
                <select
                  value={line.item_id}
                  onChange={(e) => pickItem(index, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                >
                  <option value="">Custom</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold text-emerald-950 sm:col-span-2">
                Description
                <input
                  value={line.description}
                  onChange={(e) => updateLine(index, { description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                />
              </label>
              <label className="text-xs font-bold text-emerald-950">
                HSN
                <input
                  value={line.hsn}
                  onChange={(e) => updateLine(index, { hsn: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                />
              </label>
              <label className="text-xs font-bold text-emerald-950">
                GST %
                <select
                  value={line.gst_rate}
                  onChange={(e) => updateLine(index, { gst_rate: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                >
                  <option value={5}>5% (2.5+2.5)</option>
                  <option value={12}>12% (6+6)</option>
                  <option value={18}>18% (9+9)</option>
                  <option value={24}>24% (12+12)</option>
                  <option value={28}>28% (14+14)</option>
                </select>
              </label>
              <label className="text-xs font-bold text-emerald-950">
                Qty
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={line.qty}
                  onChange={(e) => updateLine(index, { qty: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                />
              </label>
              <label className="text-xs font-bold text-emerald-950">
                Unit
                <input
                  value={line.unit}
                  onChange={(e) => updateLine(index, { unit: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                />
              </label>
              <label className="text-xs font-bold text-emerald-950">
                Rate
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.rate}
                  onChange={(e) => updateLine(index, { rate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2"
                />
              </label>
              <div className="flex items-end justify-between gap-2 sm:col-span-2">
                <p className="text-sm font-semibold text-emerald-950">Amt ₹{Number(line.amount || 0).toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => setLines((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)))}
                  className="rounded-lg border border-red-200 p-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-1 text-sm text-emerald-950 sm:justify-items-end">
          <p>Taxable: ₹{totals.taxable_total.toFixed(2)}</p>
          <p>CGST: ₹{totals.cgst_total.toFixed(2)} · SGST: ₹{totals.sgst_total.toFixed(2)}</p>
          <p>Round off: ₹{totals.round_off.toFixed(2)}</p>
          <p className="text-lg font-bold">Grand total: ₹{totals.grand_total.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(false)}
          className="rounded-full border border-emerald-950/15 bg-white px-5 py-3 text-sm font-bold text-emerald-950 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(true)}
          className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? 'Working…' : 'Generate PDF & save'}
        </button>
        {form.party_phone && (
          <a
            href={buildWhatsAppLink(
              form.party_phone,
              pdfUrl
                ? `Hello ${form.party_name}, please find your Ideal Energy invoice ${form.invoice_no}.\nDownload PDF: ${pdfUrl}`
                : `Hello ${form.party_name}, please find Ideal Energy invoice ${form.invoice_no}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#25d366] px-5 py-3 text-sm font-bold text-white"
          >
            {pdfUrl ? '📎 WhatsApp with PDF' : 'WhatsApp party'}
          </a>
        )}
        {billSaved && (
          <button
            type="button"
            onClick={() => navigate('/bills')}
            className="rounded-full border border-emerald-950/15 bg-white px-5 py-3 text-sm font-bold text-emerald-950"
          >
            Go to bills →
          </button>
        )}
      </div>
    </div>
  )
}
