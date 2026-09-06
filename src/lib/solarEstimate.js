/** Rough India rooftop estimates for lead-magnet calculator (not a formal quote). */

const AVG_TARIFF = 8 // ₹ / unit
const UNITS_PER_KW_PER_MONTH = 120
const COST_PER_KW = 55_000
const SELF_CONSUMPTION = 0.85
const SUBSIDY_PER_KW = 18_000 // indicative PM Surya Ghar-style support (capped below)
const MAX_SUBSIDY_KW = 3

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
  const subsidyKw = propertyType === 'residential' ? Math.min(systemKw, MAX_SUBSIDY_KW) : 0
  const subsidy = Math.round(subsidyKw * SUBSIDY_PER_KW)
  const netCost = Math.max(0, grossCost - subsidy)

  const annualSavings = Math.round(bill * 12 * SELF_CONSUMPTION)
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
