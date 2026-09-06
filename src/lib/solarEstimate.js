/** Rough India rooftop estimates for lead-magnet calculator (not a formal quote). */

const AVG_TARIFF = 8 // ₹ / unit
const UNITS_PER_KW_PER_MONTH = 120
const COST_PER_KW = 55_000
/** Indicative PM Surya Ghar-style support (residential, capped at 3 kW). */
const SUBSIDY_FIRST_2KW_RATE = 30_000
const SUBSIDY_NEXT_KW_RATE = 18_000
const MAX_SUBSIDY_KW = 3

function residentialSubsidy(systemKw) {
  const kw = Math.min(Math.max(0, systemKw), MAX_SUBSIDY_KW)
  const first = Math.min(kw, 2) * SUBSIDY_FIRST_2KW_RATE
  const next = Math.max(0, kw - 2) * SUBSIDY_NEXT_KW_RATE
  return Math.round(first + next)
}

/** Bill cycle length in months (Gujarat DISCOMs often bill every 2 months). */
export const BILL_PERIODS = [
  { months: 1, label: 'Monthly', hint: 'Bill comes every month' },
  { months: 2, label: 'Every 2 months', hint: 'Common in Gujarat (UGVCL / DGVCL / MGVCL / PGVCL)' },
]

export function normalizeMonthlyBill(billAmount, billPeriodMonths = 1) {
  const amount = Math.max(0, Number(billAmount) || 0)
  const period = Math.max(1, Number(billPeriodMonths) || 1)
  return amount / period
}

export function estimateSolarSavings({
  billAmount,
  monthlyBill,
  billPeriodMonths = 1,
  propertyType = 'residential',
} = {}) {
  const period = [1, 2].includes(Number(billPeriodMonths)) ? Number(billPeriodMonths) : 1
  const enteredBill = Math.max(0, Number(billAmount ?? monthlyBill) || 0)
  const bill = normalizeMonthlyBill(enteredBill, period)

  const monthlyUnits = bill / AVG_TARIFF
  const systemKw = Math.min(20, Math.max(1, Math.round((monthlyUnits / UNITS_PER_KW_PER_MONTH) * 2) / 2))

  const grossCost = systemKw * COST_PER_KW
  const subsidy = propertyType === 'residential' ? residentialSubsidy(systemKw) : 0
  const netCost = Math.max(0, grossCost - subsidy)

  // Year-1 savings ≈ yearly bill; payback is always from post-subsidy net investment
  const annualSavings = Math.round(bill * 12)
  const paybackYears = annualSavings > 0 ? Math.round((netCost / annualSavings) * 10) / 10 : null
  const twentyFiveYearSavings = annualSavings * 25

  return {
    billAmount: enteredBill,
    billPeriodMonths: period,
    billPeriodLabel: period === 2 ? 'every 2 months' : 'monthly',
    monthlyBill: Math.round(bill),
    monthlyUnits: Math.round(monthlyUnits),
    systemKw,
    grossCost,
    subsidy,
    netCost,
    annualSavings,
    monthlySavings: Math.round(annualSavings / 12),
    paybackYears,
    twentyFiveYearSavings,
    propertyType,
  }
}

export function formatInr(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}
