export function isValidEmail(email) {
  if (!email) return false
  const clean = String(email).toLowerCase().trim()
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(clean)) return false
  // allow only specific domains
  const allowedRe = /^[^\s@]+@(gmail\.com|hotmail\.com|admin\.cl)$/
  return allowedRe.test(clean)
}

export function isValidRut(rut) {
  if (!rut) return false
  // remove dots, hyphens and spaces
  const clean = String(rut).replace(/\./g, '').replace(/-/g, '').replace(/\s+/g, '').toUpperCase()
  if (clean.length < 2) return false

  const dv = clean.slice(-1)
  const num = clean.slice(0, -1)
  if (!/^[0-9]+$/.test(num)) return false

  let sum = 0
  let mul = 2
  for (let i = num.length - 1; i >= 0; i--) {
    sum += parseInt(num.charAt(i), 10) * mul
    mul = mul === 7 ? 2 : mul + 1
  }
  const mod = 11 - (sum % 11)
  let dvCalc = ''
  if (mod === 11) dvCalc = '0'
  else if (mod === 10) dvCalc = 'K'
  else dvCalc = String(mod)

  return dvCalc === dv.toUpperCase()
}

export function isValidPhone(phone) {
  if (!phone) return false
  const cleaned = String(phone).replace(/\s+/g, '')
  // allow optional + and between 7 and 15 digits
  return /^\+?\d{7,15}$/.test(cleaned)
}

export function isNonEmpty(str) {
  return str != null && String(str).trim().length > 0
}
