/**
 * Formatting helpers — currency, dates, phone numbers.
 * The app targets an Israeli salon, so defaults are ILS + he-IL.
 */
import { format, parseISO, isValid } from 'date-fns'

/** Format a number as Israeli Shekels. */
export function formatCurrency(amount, currency = 'ILS') {
  const value = Number(amount) || 0
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

/** Safely format a date (Date | ISO string | Firestore Timestamp) to dd/MM/yyyy. */
export function formatDate(value, pattern = 'dd/MM/yyyy') {
  const date = toDate(value)
  return date && isValid(date) ? format(date, pattern) : ''
}

/** Format a date + time string for display. */
export function formatDateTime(value) {
  return formatDate(value, 'dd/MM/yyyy HH:mm')
}

/** Normalize many possible date representations into a JS Date (or null). */
export function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  // Firestore Timestamp duck-typing
  if (typeof value === 'object' && typeof value.toDate === 'function') return value.toDate()
  if (typeof value === 'object' && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000)
  }
  if (typeof value === 'string') {
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : new Date(value)
  }
  return new Date(value)
}

/** Pretty-print an Israeli phone number: 0501234567 -> 050-123-4567. */
export function formatPhone(phone) {
  if (!phone) return ''
  const digits = String(phone).replace(/\D/g, '')
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

/** First-letter initials for avatars. */
export function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
