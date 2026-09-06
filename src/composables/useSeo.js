const SITE_NAME = 'Ideal Energy'
const DEFAULT_DESCRIPTION =
  'Ideal Energy designs and installs premium residential, commercial, and industrial solar solutions with expert support across India.'
const DEFAULT_IMAGE = '/og-image.svg'

function siteUrl() {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return 'https://idealenergy.in'
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function upsertJsonLd(id, data) {
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

function removeJsonLd(id) {
  document.getElementById(id)?.remove()
}

export function applySeo(meta = {}) {
  const title = meta.title || `${SITE_NAME} | Premium Solar Solutions`
  const description = meta.description || DEFAULT_DESCRIPTION
  const path = meta.path || '/'
  const image = meta.image || DEFAULT_IMAGE
  const robots = meta.robots || 'index,follow'
  const canonical = `${siteUrl()}${path === '/' ? '' : path}`
  const absoluteImage = image.startsWith('http') ? image : `${siteUrl()}${image}`

  document.title = title

  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
  upsertMeta('meta[name="author"]', { name: 'author', content: SITE_NAME })
  upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#071c16' })

  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: meta.type || 'website' })
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImage })

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImage })

  upsertLink('canonical', canonical)

  if (meta.jsonLd) {
    upsertJsonLd('seo-jsonld', meta.jsonLd)
  } else {
    removeJsonLd('seo-jsonld')
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl(),
    logo: `${siteUrl()}/favicon.svg`,
    description: DEFAULT_DESCRIPTION,
    email: 'idealeneergy@gmail.com',
    telephone: '+916355859771',
    sameAs: [
      'https://www.instagram.com',
      'https://www.linkedin.com',
      'https://www.facebook.com',
      'https://www.youtube.com',
    ],
    areaServed: 'IN',
    knowsAbout: ['Solar energy', 'Rooftop solar', 'Battery storage', 'Commercial solar'],
  }
}
