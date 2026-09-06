/**
 * Send admin email via Resend HTTP API (server-only).
 * https://resend.com — free tier works with onboarding@resend.dev → your inbox.
 */

export async function notifyAdminEmail(
  { subject, text, html, replyTo } = {},
  env = process.env,
) {
  const apiKey = env.RESEND_API_KEY || ''
  const to = env.ADMIN_EMAIL || ''
  const from = env.EMAIL_FROM || 'Ideal Energy <onboarding@resend.dev>'

  if (!apiKey || !to) {
    return {
      ok: false,
      status: 503,
      error:
        'Email is not configured. Set RESEND_API_KEY and ADMIN_EMAIL (see .env.example).',
    }
  }

  if (!subject || !text) {
    return { ok: false, status: 400, error: 'Subject and text are required.' }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: String(subject).slice(0, 200),
      text: String(text).slice(0, 8000),
      html: html ? String(html).slice(0, 16000) : undefined,
      reply_to: replyTo || undefined,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    return {
      ok: false,
      status: 502,
      error: data?.message || 'Resend email failed.',
      details: data,
    }
  }

  return { ok: true, status: 200, id: data?.id || null }
}

export function leadEmailContent(lead = {}) {
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || lead.name || 'Guest'
  const subject = `New Ideal Energy lead — ${lead.source || 'website'}`
  const lines = [
    'New website lead',
    '',
    `Name: ${name}`,
    `Phone: ${lead.phone || '-'}`,
    `Email: ${lead.email || '-'}`,
    `Source: ${lead.source || '-'}`,
    lead.utm_campaign ? `Campaign: ${lead.utm_campaign}` : null,
    lead.utm_medium ? `Medium: ${lead.utm_medium}` : null,
    lead.address ? `Address: ${lead.address}` : null,
    lead.landing_page ? `Landing: ${lead.landing_page}` : null,
    '',
    'Message:',
    lead.message || '(no message)',
  ].filter((line) => line !== null)

  const text = lines.join('\n')
  const html = `<pre style="font-family:ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap;line-height:1.5">${escapeHtml(text)}</pre>`

  return { subject, text, html, replyTo: lead.email || undefined }
}

export function calculatorEmailContent(estimate = {}) {
  const period = estimate.billPeriodLabel || (estimate.billPeriodMonths === 2 ? 'every 2 months' : 'monthly')
  const entered = estimate.billAmount ?? estimate.monthlyBill
  const subject = `Solar calculator used — ₹${entered || '?'}/${period === 'every 2 months' ? '2mo' : 'mo'}`
  const lines = [
    'Someone used the Ideal Energy solar calculator',
    '',
    `Bill entered: ₹${entered ?? '-'} (${period})`,
    `Equivalent monthly: ₹${estimate.monthlyBill ?? '-'}`,
    `Property: ${estimate.propertyType || '-'}`,
    `Suggested size: ${estimate.systemKw ?? '-'} kW`,
    `Est. monthly savings: ₹${estimate.monthlySavings ?? '-'}`,
    `Est. net cost: ₹${estimate.netCost ?? '-'}`,
    `Est. payback: ${estimate.paybackYears ?? '-'} years`,
    '',
    'They may still be filling name & phone on the page.',
  ]

  const text = lines.join('\n')
  const html = `<pre style="font-family:ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap;line-height:1.5">${escapeHtml(text)}</pre>`

  return { subject, text, html }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
