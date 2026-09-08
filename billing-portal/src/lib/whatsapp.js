/** Build a WhatsApp deep link. Country code intentionally fixed to +91. */
export function buildWhatsAppLink(mobile, text = '') {
  const digits = String(mobile || '').replace(/\D/g, '')
  const withCountry = digits.startsWith('91') ? digits : `91${digits.slice(-10)}`
  const base = `https://wa.me/${withCountry}`
  if (!text) return base
  return `${base}?text=${encodeURIComponent(text)}`
}
