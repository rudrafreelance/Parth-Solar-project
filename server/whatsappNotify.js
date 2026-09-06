/**
 * Meta WhatsApp Cloud API — notify admin without opening WhatsApp for the visitor.
 * Secrets stay server-side only (never VITE_*).
 */

const GRAPH_VERSION = 'v21.0'

function getConfig(env = process.env) {
  return {
    accessToken: env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID || '',
    adminNumber: (env.WHATSAPP_ADMIN_NUMBER || '').replace(/\D/g, ''),
    templateName: env.WHATSAPP_TEMPLATE_NAME || '',
    templateLanguage: env.WHATSAPP_TEMPLATE_LANGUAGE || 'en',
  }
}

function buildAdminBody({ name, phone, message }) {
  const lines = [
    'New website chat — Ideal Energy',
    `Name: ${name?.trim() || 'Guest'}`,
    phone?.trim() ? `Phone: ${phone.trim()}` : null,
    '',
    message.trim(),
  ].filter((line) => line !== null)

  return lines.join('\n')
}

function buildPayload(config, { name, phone, message }) {
  const to = config.adminNumber
  const bodyText = buildAdminBody({ name, phone, message })

  if (config.templateName) {
    return {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: config.templateName,
        language: { code: config.templateLanguage },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: (name?.trim() || 'Guest').slice(0, 60) },
              { type: 'text', text: (phone?.trim() || '-').slice(0, 20) },
              { type: 'text', text: message.trim().slice(0, 900) },
            ],
          },
        ],
      },
    }
  }

  return {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { preview_url: false, body: bodyText.slice(0, 4096) },
  }
}

/**
 * @param {{ name?: string, phone?: string, message: string }} input
 * @param {NodeJS.ProcessEnv} [env]
 */
export async function notifyAdminWhatsApp(input, env = process.env) {
  const message = String(input?.message || '').trim()
  if (!message) {
    return { ok: false, status: 400, error: 'Message is required.' }
  }
  if (message.length > 2000) {
    return { ok: false, status: 400, error: 'Message is too long.' }
  }

  const name = String(input?.name || '').trim().slice(0, 80)
  const phone = String(input?.phone || '').trim().slice(0, 20)

  const config = getConfig(env)
  if (!config.accessToken || !config.phoneNumberId || !config.adminNumber) {
    return {
      ok: false,
      status: 503,
      error:
        'WhatsApp API is not configured. Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_ADMIN_NUMBER.',
    }
  }

  const payload = buildPayload(config, { name, phone, message })
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${config.phoneNumberId}/messages`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const metaError =
      data?.error?.message || data?.error?.error_user_msg || 'Meta WhatsApp API request failed.'
    return { ok: false, status: 502, error: metaError, details: data?.error }
  }

  return { ok: true, status: 200, id: data?.messages?.[0]?.id || null }
}

/**
 * Parse JSON body from a Node IncomingMessage (Vite middleware / Vercel).
 */
export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  return JSON.parse(raw)
}
