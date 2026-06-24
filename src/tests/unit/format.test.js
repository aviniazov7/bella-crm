import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatPhone, initials, toDate } from '../../utils/format'

describe('formatCurrency', () => {
  it('formats numbers as ILS', () => {
    expect(formatCurrency(150)).toContain('150')
    expect(formatCurrency(150)).toContain('₪')
  })

  it('treats invalid input as zero', () => {
    expect(formatCurrency('abc')).toContain('0')
    expect(formatCurrency(null)).toContain('0')
  })
})

describe('formatDate', () => {
  it('formats an ISO string to dd/MM/yyyy', () => {
    expect(formatDate('2026-06-24')).toBe('24/06/2026')
  })

  it('returns empty string for falsy / invalid values', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate('not-a-date')).toBe('')
  })
})

describe('toDate', () => {
  it('passes through Date objects', () => {
    const d = new Date('2026-01-01')
    expect(toDate(d)).toBe(d)
  })

  it('handles Firestore Timestamp-like objects', () => {
    const ts = { seconds: 1000, toDate: () => new Date(1000 * 1000) }
    expect(toDate(ts).getTime()).toBe(1000 * 1000)
  })

  it('returns null for empty input', () => {
    expect(toDate(null)).toBeNull()
  })
})

describe('formatPhone', () => {
  it('formats a 10-digit number with dashes', () => {
    expect(formatPhone('0501234567')).toBe('050-123-4567')
  })

  it('returns the original value when not 10 digits', () => {
    expect(formatPhone('123')).toBe('123')
    expect(formatPhone('')).toBe('')
  })
})

describe('initials', () => {
  it('takes up to two initials', () => {
    expect(initials('Bella Cohen')).toBe('BC')
    expect(initials('Bella')).toBe('B')
  })

  it('handles empty input', () => {
    expect(initials('')).toBe('?')
  })
})
