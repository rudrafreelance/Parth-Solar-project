/** Shared Ideal Energy contact — WhatsApp without Meta API */

export const ADMIN_WHATSAPP = '916355859771'
export const ADMIN_PHONE_DISPLAY = '63558 59771'
export const ADMIN_TEL_HREF = 'tel:+916355859771'
export const ADMIN_WHATSAPP_HREF = `https://wa.me/${ADMIN_WHATSAPP}`

export const ADMIN_EMAIL = 'idealeneergy@gmail.com'
export const ADMIN_EMAIL_HREF = `mailto:${ADMIN_EMAIL}`

/** Update these to your real profile URLs when ready */
export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/idealeneergy?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==', icon: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61592209329460', icon: 'facebook' },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
]

export function openWhatsApp(text) {
  const url = `${ADMIN_WHATSAPP_HREF}?text=${encodeURIComponent(String(text || '').trim())}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
