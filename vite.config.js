import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { adminNotifyApiPlugin } from './vite-plugins/adminNotifyApi.js'
import { SITE_URL_FALLBACK, getIndexablePages } from './src/data/localSeo.js'

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function pageHtml(shell, page, site) {
  const url = page.path === '/' ? `${site}/` : `${site}${page.path}`
  const heading = page.title.replace(/\s+\|\s+Ideal Energy$/, '')
  const body = `<header><p><a href="/">Ideal Energy</a> — solar company in Ahmedabad. <a href="tel:+916355859771">Call 63558 59771</a></p><nav><a href="/solar-panel-price-ahmedabad">Solar panel price in Ahmedabad</a> <a href="/services">Solar services</a> <a href="/calculator">Solar calculator</a> <a href="/projects">Projects</a> <a href="/about">About</a></nav></header><main><h1>${esc(heading)}</h1><p>${esc(page.description)}</p></main>`
  let html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/<div id="app">[\s\S]*?<\/div>/, `<div id="app">${body}</div>`)

  if (page.path !== '/') {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      url,
      isPartOf: { '@type': 'WebSite', name: 'Ideal Energy', url: `${site}/` },
    }
    html = html.replace(
      /<script type="application\/ld\+json" id="seo-jsonld">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" id="seo-jsonld">${JSON.stringify(jsonLd)}</script>`,
    )
  }

  return html
}

function seoFilesPlugin() {
  return {
    name: 'ideal-seo-files',
    apply: 'build',
    closeBundle() {
      const env = loadEnv('production', process.cwd(), '')
      const site = (env.VITE_SITE_URL || SITE_URL_FALLBACK).replace(/\/$/, '')
      const pages = getIndexablePages()
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = pages
        .map(
          (entry) => `  <url>
    <loc>${site}${entry.path === '/' ? '/' : entry.path}</loc>
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
        `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\nDisallow: /billing\nDisallow: /billing/\nDisallow: /thank-you\nDisallow: /go/\n\nSitemap: ${site}/sitemap.xml\n`,
      )

      const shell = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      for (const page of pages) {
        const html = pageHtml(shell, page, site)
        const file = page.path === '/' ? resolve(outDir, 'index.html') : resolve(outDir, `.${page.path}`, 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html)
      }
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
