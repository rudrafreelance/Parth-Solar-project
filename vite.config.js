import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { adminNotifyApiPlugin } from './vite-plugins/adminNotifyApi.js'

const PUBLIC_SEO_PATHS = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/services/residential', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/commercial', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/industrial', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/water-heater', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/solar-pump', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/battery', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/maintenance', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/amc', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/government-subsidy', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculator', priority: '0.9', changefreq: 'monthly' },
  { path: '/projects', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
]

function seoFilesPlugin() {
  return {
    name: 'ideal-seo-files',
    apply: 'build',
    closeBundle() {
      const env = loadEnv('production', process.cwd(), '')
      const site = (env.VITE_SITE_URL || 'https://idealenergy.in').replace(/\/$/, '')
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = PUBLIC_SEO_PATHS
        .map(
          (entry) => `  <url>
    <loc>${site}${entry.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
        )
        .join('\n')
      const outDir = resolve(process.cwd(), 'dist')
      writeFileSync(
        resolve(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
      writeFileSync(
        resolve(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /billing\nDisallow: /thank-you\nDisallow: /go/\n\nSitemap: ${site}/sitemap.xml\n`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), adminNotifyApiPlugin(), seoFilesPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
})
