const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
const ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID || ''
const ADS_CONVERSION_LABEL = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL || ''

let initialized = false

/** Load gtag.js once when GA4 and/or Google Ads IDs are configured. */
export function initAnalytics() {
  if (initialized || typeof document === 'undefined') return
  const primaryId = GA_ID || ADS_ID
  if (!primaryId) return

  initialized = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtagFn() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  if (GA_ID) window.gtag('config', GA_ID)
  if (ADS_ID && ADS_ID !== GA_ID) window.gtag('config', ADS_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryId)}`
  document.head.appendChild(script)
}

/** Fire when a lead is confirmed (thank-you page). */
export function trackLeadConversion(extra = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('event', 'generate_lead', {
    event_category: 'lead',
    event_label: extra.from || 'website',
    ...extra,
  })

  if (ADS_ID && ADS_CONVERSION_LABEL) {
    window.gtag('event', 'conversion', {
      send_to: `${ADS_ID}/${ADS_CONVERSION_LABEL}`,
      ...extra,
    })
  }
}

export function isAnalyticsConfigured() {
  return Boolean(GA_ID || ADS_ID)
}
