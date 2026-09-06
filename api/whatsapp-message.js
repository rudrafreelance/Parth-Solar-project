import { notifyAdminWhatsApp, readJsonBody } from '../server/whatsappNotify.js'

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = await readJsonBody(req)
    const result = await notifyAdminWhatsApp(body)

    if (!result.ok) {
      return res.status(result.status).json({ error: result.error })
    }

    return res.status(200).json({ ok: true, id: result.id })
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Failed to send WhatsApp notification.',
    })
  }
}
