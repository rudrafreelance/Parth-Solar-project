import { loadEnv } from 'vite'
import { notifyAdmin } from '../server/notifyAdmin.js'
import { notifyAdminWhatsApp, readJsonBody } from '../server/whatsappNotify.js'

/**
 * Local `/api/*` handlers during vite / preview.
 * Production: Vercel `api/*.js` serverless functions.
 */
export function adminNotifyApiPlugin() {
  return {
    name: 'admin-notify-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      Object.assign(process.env, env)
      server.middlewares.use(createMiddleware())
    },
    configurePreviewServer(server) {
      const env = loadEnv('production', process.cwd(), '')
      Object.assign(process.env, env)
      server.middlewares.use(createMiddleware())
    },
  }
}

function createMiddleware() {
  return async (req, res, next) => {
    const path = req.url?.split('?')[0]
    if (path !== '/api/notify-admin' && path !== '/api/whatsapp-message') return next()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }

    try {
      const body = await readJsonBody(req)
      const result =
        path === '/api/notify-admin'
          ? await notifyAdmin(body)
          : await notifyAdminWhatsApp(body)

      res.statusCode = result.ok ? 200 : result.status
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify(
          result.ok
            ? { ok: true, id: result.id, channels: result.channels }
            : { error: result.error, channels: result.channels },
        ),
      )
    } catch (error) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          error: error?.message || 'Admin notify failed.',
        }),
      )
    }
  }
}
