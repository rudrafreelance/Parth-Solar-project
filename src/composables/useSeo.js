const SITE_NAME = 'Ideal Energy'
const DEFAULT_DESCRIPTION =
  'Ideal Energy designs and installs premium residential, commercial, and industrial solar solutions with expert support across India.'
const DEFAULT_IMAGE = '/og-image.svg'

function siteUrl() {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return 'https://ideal-energy.in'
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

  if (meta.jsonLd2) {
    upsertJsonLd('seo-jsonld-2', meta.jsonLd2)
  } else {
    removeJsonLd('seo-jsonld-2')
  }
}

/**
 * LocalBusiness schema — more specific and SEO-relevant than plain Organization
 * for a solar installation company with a physical presence in Ahmedabad.
 * Update social media URLs once you have the actual handles.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: SITE_NAME,
    url: siteUrl(),
    logo: `${siteUrl()}/favicon.svg`,
    image: `${siteUrl()}/og-image.svg`,
    description:
      'Ideal Energy is an Ahmedabad-based solar energy company offering rooftop solar installation, commercial & industrial solar systems, battery storage, and solar pump solutions across Gujarat with PM Surya Ghar Yojana subsidy guidance.',
    email: 'idealeneergy@gmail.com',
    telephone: '+916355859771',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.0225,
      longitude: 72.5714,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    areaServed: {
      '@type': 'State',
      name: 'Gujarat',
      containedInPlace: {
        '@type': 'Country',
        name: 'India',
      },
    },
    knowsAbout: [
      'Rooftop solar installation',
      'Commercial solar systems',
      'Industrial solar systems',
      'Battery storage solutions',
      'Solar water pumps',
      'PM Surya Ghar Yojana subsidy',
      'Net metering',
      'Solar AMC',
    ],
    // TODO: Replace with actual social media profile URLs for Ideal Energy
    sameAs: [
      'https://www.instagram.com/idealeneergy?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==', // update with actual handle
      'https://www.facebook.com/profile.php?id=61592209329460', // update with actual handle
      'https://www.linkedin.com/company/idealenergy', // update with actual handle
    ],
  }
}

/**
 * Service schema — use on /services and individual service pages.
 * Helps Google show rich results for specific service queries.
 */
export function serviceJsonLd() {
  const base = siteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Solar Services by Ideal Energy',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: 'Residential Rooftop Solar',
          description:
            'Complete rooftop solar panel installation for homes in Gujarat with PM Surya Ghar Yojana subsidy support, net metering, and long-term AMC.',
          provider: { '@type': 'LocalBusiness', name: SITE_NAME, url: base },
          areaServed: 'Gujarat, India',
          url: `${base}/services/residential-rooftop`,
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          name: 'Commercial & Industrial Solar',
          description:
            'Large-scale rooftop solar systems for factories, offices, and commercial buildings in Gujarat to reduce electricity costs by up to 90%.',
          provider: { '@type': 'LocalBusiness', name: SITE_NAME, url: base },
          areaServed: 'Gujarat, India',
          url: `${base}/services/commercial-solar`,
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: 'Solar Water Pumps',
          description:
            'Agricultural solar pump solutions for farmers in Gujarat — reduce diesel costs and get government subsidies.',
          provider: { '@type': 'LocalBusiness', name: SITE_NAME, url: base },
          areaServed: 'Gujarat, India',
          url: `${base}/services/solar-pumps`,
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Service',
          name: 'Battery Storage Solutions',
          description:
            'Solar battery storage systems to store excess energy and power your home or business during outages and peak hours.',
          provider: { '@type': 'LocalBusiness', name: SITE_NAME, url: base },
          areaServed: 'Gujarat, India',
          url: `${base}/services/battery-storage`,
        },
      },
    ],
  }
}

/**
 * FAQ schema — use on home page.
 * Helps Google show FAQ rich results directly in search for solar-related queries.
 */
export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much does rooftop solar cost in Gujarat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rooftop solar in Gujarat typically costs ₹40,000–₹60,000 per kW after PM Surya Ghar Yojana subsidies. A 3 kW system for a home costs around ₹1.2–1.5 lakh after subsidy. Ideal Energy provides transparent pricing and free site assessment.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is PM Surya Ghar Yojana and how can I get the subsidy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PM Surya Ghar Muft Bijli Yojana is a central government scheme providing up to ₹78,000 subsidy for residential rooftop solar installations. Ideal Energy handles all paperwork and subsidy application on your behalf.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many years does solar pay back in Gujarat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'With Gujarat electricity rates and generous sunlight (5.5+ peak sun hours/day), most rooftop solar systems pay back in 4–6 years. After that, you get free electricity for 20+ years.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Ideal Energy provide solar installation in Ahmedabad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Ideal Energy is headquartered in Ahmedabad and provides residential, commercial, and industrial solar installation across Gujarat. Call +91 63558 59771 for a free consultation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does solar panel installation take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ideal Energy completes most residential solar installations in 1–3 days after site survey and subsidy approval. Commercial projects may take 5–15 days depending on system size.',
        },
      },
    ],
  }
}
