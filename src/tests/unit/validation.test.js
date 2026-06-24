import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPhone, isPositiveNumber, rules } from '../../utils/validation'

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('a@b.com')).toBe(true)
  })
  it('rejects invalid emails', () => {
    expect(isValidEmail('a@b')).toBe(false)
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail(null)).toBe(false)
  })
})

describe('isValidPhone', () => {
  it('accepts 9-10 digit numbers, ignoring dashes', () => {
    expect(isValidPhone('050-123-4567')).toBe(true)
    expect(isValidPhone('021234567')).toBe(true)
  })
  it('rejects too-short numbers', () => {
    expect(isValidPhone('12345')).toBe(false)
    expect(isValidPhone('')).toBe(false)
  })
})

describe('isPositiveNumber', () => {
  it('accepts positive numbers', () => {
    expect(isPositiveNumber(5)).toBe(true)
    expect(isPositiveNumber('10')).toBe(true)
  })
  it('rejects zero, negatives and non-numbers', () => {
    expect(isPositiveNumber(0)).toBe(false)
    expect(isPositiveNumber(-3)).toBe(false)
    expect(isPositiveNumber('abc')).toBe(false)
  })
})

describe('rules', () => {
  it('email rule validates correctly', () => {
    expect(rules.email.validate('a@b.com')).toBe(true)
    expect(rules.email.validate('bad')).toBe('אימייל לא תקין')
  })
  it('amount rule rejects non-positive', () => {
    expect(rules.amount.validate('5')).toBe(true)
    expect(rules.amount.validate('0')).toBe('יש להזין סכום חיובי')
  })
})
