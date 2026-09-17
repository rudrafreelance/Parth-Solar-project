/** Shared money / FY helpers for Ideal Energy billing */

export function financialYearForDate(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  if (month >= 4) {
    return `${year}-${String(year + 1).slice(-2)}`
  }
  return `${year - 1}-${String(year).slice(-2)}`
}

export function listFinancialYears(count = 5) {
  const current = financialYearForDate(new Date())
  const startYear = Number(current.slice(0, 4))
  return Array.from({ length: count }, (_, i) => {
    const y = startYear - i
    return `${y}-${String(y + 1).slice(-2)}`
  })
}

export function formatInr(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

export function formatInrPlain(value) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

/** Format a number or string into Indian currency notation with commas, keeping decimals */
export function formatIndianNumber(val) {
  if (val === null || val === undefined || val === '') return ''
  const str = String(val).trim()
  if (!str) return ''
  const cleaned = str.replace(/,/g, '').replace(/[^0-9.-]/g, '')
  if (!cleaned) return ''
  const isNegative = cleaned.startsWith('-')
  const abs = isNegative ? cleaned.slice(1) : cleaned
  const dotIndex = abs.indexOf('.')
  let intPart = dotIndex >= 0 ? abs.slice(0, dotIndex) : abs
  const decPart = dotIndex >= 0 ? abs.slice(dotIndex + 1) : null
  if (intPart.length > 1) {
    intPart = intPart.replace(/^0+/, '') || '0'
  }
  let formattedInt = ''
  if (intPart.length > 3) {
    const lastThree = intPart.slice(-3)
    const other = intPart.slice(0, -3)
    formattedInt = other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
  } else {
    formattedInt = intPart || (dotIndex >= 0 ? '0' : '')
  }
  let res = (isNegative ? '-' : '') + formattedInt
  if (decPart !== null) res += '.' + decPart
  return res
}

/** Parse a comma-formatted or raw string into a clean float number */
export function parseIndianNumber(val) {
  if (val === null || val === undefined || val === '') return 0
  const cleaned = String(val).replace(/,/g, '').trim()
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
]
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function twoDigits(n) {
  if (n < 20) return ONES[n]
  return `${TENS[Math.floor(n / 10)]}${ONES[n % 10] ? ` ${ONES[n % 10]}` : ''}`.trim()
}

function threeDigits(n) {
  if (n < 100) return twoDigits(n)
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${twoDigits(n % 100)}` : ''}`.trim()
}

/** Indian numbering: crore / lakh / thousand */
export function amountInWords(amount) {
  const num = Math.round((Number(amount) || 0) * 100) / 100
  const whole = Math.floor(num)
  const paise = Math.round((num - whole) * 100)

  if (whole === 0 && paise === 0) return 'INR Zero Only'

  let n = whole
  const crore = Math.floor(n / 10000000)
  n %= 10000000
  const lakh = Math.floor(n / 100000)
  n %= 100000
  const thousand = Math.floor(n / 1000)
  n %= 1000
  const rest = n

  const parts = []
  if (crore) parts.push(`${threeDigits(crore)} Crore`)
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`)
  if (rest) parts.push(threeDigits(rest))

  let words = `INR ${parts.join(' ')}`
  if (paise) words += ` and ${twoDigits(paise)} Paise`
  return `${words} Only`
}

export function calcLine(qty, rate, gstRateCombined) {
  const q = Number(qty) || 0
  const r = Number(rate) || 0
  const gst = Number(gstRateCombined) || 0
  const amount = Math.round(q * r * 100) / 100
  const half = gst / 2
  const cgst = Math.round(amount * (half / 100) * 100) / 100
  const sgst = Math.round(amount * (half / 100) * 100) / 100
  return {
    amount,
    gst_rate: gst,
    cgst_rate: half,
    sgst_rate: half,
    cgst_amount: cgst,
    sgst_amount: sgst,
  }
}

export function calcBillTotals(lines) {
  const taxable = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0)
  const cgst = lines.reduce((s, l) => s + (Number(l.cgst_amount) || 0), 0)
  const sgst = lines.reduce((s, l) => s + (Number(l.sgst_amount) || 0), 0)
  const raw = taxable + cgst + sgst
  const rounded = Math.round(raw)
  const round_off = Math.round((rounded - raw) * 100) / 100
  return {
    taxable_total: Math.round(taxable * 100) / 100,
    cgst_total: Math.round(cgst * 100) / 100,
    sgst_total: Math.round(sgst * 100) / 100,
    round_off,
    grand_total: rounded,
    amount_in_words: amountInWords(rounded),
  }
}

/** Group lines by HSN for purchase tax breakdown */
export function hsnTaxBreakdown(lines) {
  const map = new Map()
  for (const line of lines) {
    const key = `${line.hsn || ''}|${line.cgst_rate}|${line.sgst_rate}`
    const prev = map.get(key) || {
      hsn: line.hsn || '',
      taxable: 0,
      cgst_rate: line.cgst_rate,
      sgst_rate: line.sgst_rate,
      cgst: 0,
      sgst: 0,
    }
    prev.taxable += Number(line.amount) || 0
    prev.cgst += Number(line.cgst_amount) || 0
    prev.sgst += Number(line.sgst_amount) || 0
    map.set(key, prev)
  }
  return [...map.values()].map((row) => ({
    ...row,
    taxable: Math.round(row.taxable * 100) / 100,
    cgst: Math.round(row.cgst * 100) / 100,
    sgst: Math.round(row.sgst * 100) / 100,
    tax: Math.round((row.cgst + row.sgst) * 100) / 100,
  }))
}
