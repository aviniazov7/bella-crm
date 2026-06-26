import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Supabase client
const authMocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(),
  getSession: vi.fn(),
}))

vi.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: authMocks.signInWithPassword,
      signOut: authMocks.signOut,
      onAuthStateChange: authMocks.onAuthStateChange,
      getSession: authMocks.getSession,
    }
  },
}))

import { signIn, signOut, subscribeToAuth, authErrorMessage } from '../../services/auth'

beforeEach(() => {
  vi.clearAllMocks()
  authMocks.getSession.mockResolvedValue({ data: { session: null } })
  authMocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
})

describe('signIn', () => {
  it('returns the authenticated user', async () => {
    authMocks.signInWithPassword.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })
    const user = await signIn('a@b.com', 'pw')
    expect(user).toEqual({ id: 'u1' })
    expect(authMocks.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pw' })
  })

  it('throws on error', async () => {
    authMocks.signInWithPassword.mockResolvedValue({ data: null, error: { message: 'Invalid credentials', code: 'invalid_credentials' } })
    await expect(signIn('a@b.com', 'wrong')).rejects.toBeTruthy()
  })
})

describe('signOut', () => {
  it('calls supabase signOut', async () => {
    authMocks.signOut.mockResolvedValue({ error: null })
    await signOut()
    expect(authMocks.signOut).toHaveBeenCalledOnce()
  })
})

describe('subscribeToAuth', () => {
  it('registers the callback', () => {
    const cb = vi.fn()
    subscribeToAuth(cb)
    expect(authMocks.onAuthStateChange).toHaveBeenCalled()
  })
})

describe('authErrorMessage', () => {
  it('maps known codes to Hebrew messages', () => {
    expect(authErrorMessage('auth/wrong-password')).toBe('סיסמה שגויה')
    expect(authErrorMessage('auth/invalid-credential')).toBe('פרטי התחברות שגויים')
    expect(authErrorMessage('invalid_credentials')).toBe('פרטי התחברות שגויים')
  })
  it('falls back for unknown codes', () => {
    expect(authErrorMessage('auth/whatever')).toBe('אירעה שגיאה בהתחברות')
  })
})
