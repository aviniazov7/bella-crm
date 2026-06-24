/**
 * Lightweight validation helpers used by forms and react-hook-form rules.
 */

/** Validate an email address. */
export function isValidEmail(email) {
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Validate an Israeli mobile phone number (9-10 digits, optional dashes). */
export function isValidPhone(phone) {
  if (!phone) return false
  const digits = String(phone).replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 10
}

/** Validate a positive numeric amount. */
export function isPositiveNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0
}

/** react-hook-form rule objects, reused across forms. */
export const rules = {
  required: { required: 'שדה חובה' },
  email: {
    required: 'שדה חובה',
    validate: (v) => isValidEmail(v) || 'אימייל לא תקין',
  },
  phone: {
    required: 'שדה חובה',
    validate: (v) => isValidPhone(v) || 'מספר טלפון לא תקין',
  },
  amount: {
    required: 'שדה חובה',
    validate: (v) => isPositiveNumber(v) || 'יש להזין סכום חיובי',
  },
}
