const STORAGE_KEY = 'ideal_energy_attribution'

function readStored() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStored(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore quota / private mode */
  }
}

function clean(value, max = 120) {
  return String(value || '')
    .trim()
    .slice(0, max)
}

/**
 * Capture UTM + landing/referrer once per session (first touch wins).
 * Call on app boot and whenever the route changes with new UTM params.
 */
export function captureLeadAttribution(search = typeof window !== 'undefined' ? window.location.search : '') {
  if (typeof window === 'undefined') return getLeadAttribution()

  const params = new URLSearchParams(search)
  const existing = readStored()

  // First-touch attribution: keep the first UTM set for the session.
  const next = {
    utm_source: clean(existing?.utm_source || params.get('utm_source'), 80),
    utm_medium: clean(existing?.utm_medium || params.get('utm_medium'), 80),
    utm_campaign: clean(existing?.utm_campaign || params.get('utm_campaign'), 120),
    utm_content: clean(existing?.utm_content || params.get('utm_content'), 120),
    utm_term: clean(existing?.utm_term || params.get('utm_term'), 120),
    landing_page:
      existing?.landing_page ||
      clean(`${window.location.pathname}${window.location.search}`, 240),
    referrer: existing?.referrer || clean(document.referrer, 240),
    captured_at: existing?.captured_at || new Date().toISOString(),
  }

  writeStored(next)
  return next
}

/**
 * Google Ads landing defaults when UTMs are missing.
 * Fills empty fields only — never overwrites an existing first-touch UTM.
 */
export function ensureGoogleAdsAttribution({ campaign = 'rooftop_search' } = {}) {
  if (typeof window === 'undefined') return getLeadAttribution()

  const params = new URLSearchParams(window.location.search)
  const fromQuery = clean(params.get('utm_campaign') || campaign, 120)
  captureLeadAttribution(window.location.search)

  const existing = readStored() || {}
  const next = {
    ...existing,
    utm_source: clean(existing.utm_source || 'google', 80),
    utm_medium: clean(existing.utm_medium || 'cpc', 80),
    utm_campaign: clean(existing.utm_campaign || fromQuery, 120),
    landing_page:
      existing.landing_page ||
      clean(`${window.location.pathname}${window.location.search}`, 240),
    referrer: existing.referrer || clean(document.referrer, 240),
    captured_at: existing.captured_at || new Date().toISOString(),
  }

  writeStored(next)
  return next
}

export function getLeadAttribution() {
  if (typeof window === 'undefined') {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
      landing_page: '',
      referrer: '',
    }
  }
  return captureLeadAttribution()
}

/** Map UTMs / referrer into a short source label for admin filtering. */
export function resolveLeadSource(fallback = 'website_contact') {
  const a = getLeadAttribution()
  const source = (a.utm_source || '').toLowerCase()
  const medium = (a.utm_medium || '').toLowerCase()
  const referrer = (a.referrer || '').toLowerCase()

  if (source) {
    if (source.includes('google') && (medium.includes('cpc') || medium.includes('ppc') || medium.includes('paid'))) {
      return 'google_ads'
    }
    if (['facebook', 'fb', 'instagram', 'ig', 'meta'].some((v) => source.includes(v))) {
      return 'meta_ads'
    }
    if (source.includes('google')) return 'google'
    return clean(a.utm_source, 40) || fallback
  }

  if (medium === 'cpc' || medium === 'ppc') return 'paid_search'
  if (referrer.includes('google.') || referrer.includes('bing.')) return 'organic_search'
  if (referrer.includes('facebook.') || referrer.includes('instagram.')) return 'social'
  if (referrer.includes('youtube.')) return 'youtube'

  return fallback
}

export function attributionPayload() {
  const a = getLeadAttribution()
  return {
    utm_source: a.utm_source || '',
    utm_medium: a.utm_medium || '',
    utm_campaign: a.utm_campaign || '',
    utm_content: a.utm_content || '',
    utm_term: a.utm_term || '',
    landing_page: a.landing_page || '',
    referrer: a.referrer || '',
  }
}
