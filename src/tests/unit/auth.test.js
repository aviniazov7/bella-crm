import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../services/firebase', () => ({ auth: { __type: 'auth' } }))

const fbMocks = vi.hoisted(() => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: fbMocks.signInWithEmailAndPassword,
  signOut: fbMocks.signOut,
  onAuthStateChanged: fbMocks.onAuthStateChanged,
}))

import { signIn, signOut, subscribeToAuth, authErrorMessage } from '../../services/auth'

beforeEach(() => vi.clearAllMocks())

describe('signIn', () => {
  it('returns the authenticated user', async () => {
    fbMocks.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } })
    const user = await signIn('a@b.com', 'pw')
    expect(user).toEqual({ uid: 'u1' })
    expect(fbMocks.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'a@b.com',
      'pw'
    )
  })
})

describe('signOut', () => {
  it('delegates to firebase signOut', () => {
    signOut()
    expect(fbMocks.signOut).toHaveBeenCalledOnce()
  })
})

describe('subscribeToAuth', () => {
  it('registers the callback', () => {
    const cb = vi.fn()
    subscribeToAuth(cb)
    expect(fbMocks.onAuthStateChanged).toHaveBeenCalledWith(expect.anything(), cb)
  })
})

describe('authErrorMessage', () => {
  it('maps known codes to Hebrew messages', () => {
    expect(authErrorMessage('auth/wrong-password')).toBe('סיסמה שגויה')
    expect(authErrorMessage('auth/invalid-credential')).toBe('פרטי התחברות שגויים')
  })
  it('falls back for unknown codes', () => {
    expect(authErrorMessage('auth/whatever')).toBe('אירעה שגיאה בהתחברות')
  })
})
