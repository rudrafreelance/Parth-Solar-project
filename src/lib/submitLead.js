import { attributionPayload, resolveLeadSource } from '@/composables/useLeadAttribution'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

/**
 * Save lead to Supabase and notify admin via email + WhatsApp (best-effort).
 */
export async function submitLead({
  firstName = '',
  lastName = '',
  phone = '',
  email = '',
  address = '',
  message = '',
  sourceFallback = 'website_contact',
}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Form backend is not connected yet. Please call 80030 80020.')
  }

  const source = resolveLeadSource(sourceFallback)
  const attribution = attributionPayload()

  const row = {
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    address: address.trim(),
    message: message.trim(),
    status: 'new',
    source,
    ...attribution,
  }

  const { data, error } = await supabase.from('leads').insert(row).select('id').single()
  if (error) throw error

  await notifyAdminLead(row).catch(() => {})

  return { id: data?.id, source }
}

/** Notify admin when calculator estimate is generated (before contact details). */
export async function notifyCalculatorEstimate(estimate) {
  const response = await fetch('/api/notify-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'calculator_estimate',
      estimate,
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Admin notify failed')
  }

  return response.json()
}

async function notifyAdminLead(lead) {
  const response = await fetch('/api/notify-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'lead',
      lead,
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Admin notify failed')
  }
}
