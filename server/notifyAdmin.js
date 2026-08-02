import { notifyAdminWhatsApp } from './whatsappNotify.js'
import { calculatorEmailContent, leadEmailContent, notifyAdminEmail } from './notifyAdminEmail.js'

/**
 * Unified admin notify: email (Resend) + WhatsApp (Meta), best-effort each channel.
 */
export async function notifyAdmin(body = {}, env = process.env) {
  const type = body.type || 'lead'
  const channels = { email: null, whatsapp: null }

  if (type === 'calculator_estimate') {
    const emailPayload = calculatorEmailContent(body.estimate || {})
    channels.email = await notifyAdminEmail(emailPayload, env)

    const e = body.estimate || {}
    channels.whatsapp = await notifyAdminWhatsApp(
      {
        name: 'Website calculator',
        phone: '',
        message: [
          'Solar calculator used',
          `Bill: ₹${e.billAmount ?? e.monthlyBill ?? '-'} (${e.billPeriodLabel || 'monthly'})`,
          `Monthly equiv: ₹${e.monthlyBill ?? '-'}`,
          `Type: ${e.propertyType || '-'}`,
          `Size: ${e.systemKw ?? '-'} kW`,
          `Savings: ₹${e.monthlySavings ?? '-'}/mo`,
          `Net cost: ₹${e.netCost ?? '-'}`,
        ].join('\n'),
      },
      env,
    )
  } else {
    const lead = body.lead || body
    const emailPayload = leadEmailContent(lead)
    channels.email = await notifyAdminEmail(emailPayload, env)

    const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || lead.name || 'Guest'
    channels.whatsapp = await notifyAdminWhatsApp(
      {
        name,
        phone: lead.phone || '',
        message: [
          `New lead — ${lead.source || 'website'}`,
          lead.utm_campaign ? `Campaign: ${lead.utm_campaign}` : null,
          lead.address ? `Location: ${lead.address}` : null,
          '',
          lead.message || 'New enquiry from website.',
        ]
          .filter((line) => line !== null)
          .join('\n'),
      },
      env,
    )
  }

  const emailOk = channels.email?.ok
  const whatsappOk = channels.whatsapp?.ok

  if (!emailOk && !whatsappOk) {
    return {
      ok: false,
      status: 503,
      error:
        channels.email?.error ||
        channels.whatsapp?.error ||
        'Could not notify admin (configure email and/or WhatsApp).',
      channels,
    }
  }

  return { ok: true, status: 200, channels }
}
