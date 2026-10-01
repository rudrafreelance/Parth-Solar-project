import { services } from '@/components/services/servicesData'
import {
  CITY,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  REGION,
  SITE_NAME,
  SITE_URL_FALLBACK,
  getServiceSeo,
  homeFaqs,
} from '@/data/localSeo'
import { ADMIN_EMAIL } from '@/lib/contact'

const DEFAULT_IMAGE = '/og-image.svg'

export function siteUrl() {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin
  return SITE_URL_FALLBACK
}

function absoluteUrl(path = '/') {
  if (!path.startsWith('/')) return `${siteUrl()}/${path}`
  return `${siteUrl()}${path}`
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

function upsertJsonLd(data) {
  let script = document.getElementById('seo-jsonld')
  if (!data) {
    script?.remove()
    return
  }
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'seo-jsonld'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function applySeo(meta = {}) {
  const title = meta.title || DEFAULT_TITLE
  const description = meta.description || DEFAULT_DESCRIPTION
  const path = meta.path || '/'
  const image = meta.image || DEFAULT_IMAGE
  const robots = meta.robots || 'index,follow'
  const canonical = absoluteUrl(path)
  const absoluteImage = image.startsWith('http') ? image : absoluteUrl(image)

  document.title = title

  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
  upsertMeta('meta[name="author"]', { name: 'author', content: SITE_NAME })
  upsertMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'IN-GJ' })
  upsertMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: `${CITY}, ${REGION}` })
  upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#071c16' })

  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: meta.type || 'website' })
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImage })

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImage })

  upsertLink('canonical', canonical)
  upsertJsonLd(meta.jsonLd || null)
}

function localBusinessNode() {
  return {
    '@type': 'LocalBusiness',
    '@id': `${siteUrl()}/#business`,
    name: SITE_NAME,
    url: siteUrl(),
    image: absoluteUrl('/logo-cropped.png'),
    logo: absoluteUrl('/favicon.png'),
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/idealeneergy',
      'https://www.facebook.com/profile.php?id=61592209329460',
    ],
    description: DEFAULT_DESCRIPTION,
    email: ADMIN_EMAIL,
    telephone: '+91-63558-59771',
    address: {
      '@type': 'PostalAddress',
      addressLocality: CITY,
      addressRegion: REGION,
      addressCountry: 'IN',
    },
    areaServed: [
      { '@type': 'City', name: 'Ahmedabad' },
      { '@type': 'City', name: 'Gandhinagar' },
      { '@type': 'AdministrativeArea', name: 'Gujarat' },
    ],
    knowsAbout: [
      'Rooftop solar installation',
      'PM Surya Ghar subsidy',
      'Commercial solar',
      'Solar panel maintenance',
      'Solar battery storage',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Solar services in Ahmedabad',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: getServiceSeo(service.id)?.heading || service.title,
          url: absoluteUrl(`/services/${service.id}`),
          areaServed: 'Ahmedabad, Gujarat',
        },
      })),
    },
  }
}

function faqNode(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

function breadcrumbNode(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}

function graph(...nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  }
}

export function homeJsonLd() {
  return graph(localBusinessNode(), faqNode(homeFaqs), {
    '@type': 'WebSite',
    '@id': `${siteUrl()}/#website`,
    name: SITE_NAME,
    url: `${siteUrl()}/`,
    publisher: { '@id': `${siteUrl()}/#business` },
  })
}

export function serviceJsonLd(service) {
  const seo = getServiceSeo(service.id)
  return graph(localBusinessNode(), {
    '@type': 'Service',
    name: seo?.heading || service.title,
    description: seo?.description || service.description,
    url: absoluteUrl(`/services/${service.id}`),
    provider: { '@id': `${siteUrl()}/#business` },
    areaServed: {
      '@type': 'City',
      name: CITY,
    },
    serviceType: service.title,
  }, breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.title, path: `/services/${service.id}` },
  ]))
}

export function pageJsonLd(crumbs) {
  return graph(localBusinessNode(), breadcrumbNode(crumbs))
}

export function faqPageJsonLd(faqs, crumbs) {
  return graph(localBusinessNode(), faqNode(faqs), breadcrumbNode(crumbs))
}
