import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

vi.mock('../../services/firebase', () => ({ db: {}, auth: {}, storage: {} }))

// useAuth depends on the auth service subscription.
const authMocks = vi.hoisted(() => ({ subscribeToAuth: vi.fn() }))
vi.mock('../../services/auth', () => ({ subscribeToAuth: authMocks.subscribeToAuth }))

import { useDebounce } from '../../hooks/useDebounce'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'
import { useToastStore } from '../../store/toastStore'
import { useAuthStore } from '../../store/authStore'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('a', 200))
    expect(result.current).toBe('a')
  })

  it('updates only after the delay', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 200), {
      initialProps: { v: 'a' },
    })
    rerender({ v: 'b' })
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('b')
    vi.useRealTimers()
  })
})

describe('useToast', () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }))

  it('exposes success/error/info that push toasts', () => {
    const { result } = renderHook(() => useToast())
    act(() => result.current.success('ok'))
    expect(useToastStore.getState().toasts[0]).toMatchObject({ type: 'success', message: 'ok' })
  })
})

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: true })
    authMocks.subscribeToAuth.mockReset()
  })

  it('subscribes and mirrors the user into the store', async () => {
    authMocks.subscribeToAuth.mockImplementation((cb) => {
      cb({ uid: 'u1' })
      return () => {}
    })
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))
    expect(result.current.user).toEqual({ uid: 'u1' })
  })

  it('unsubscribes on unmount', () => {
    const unsub = vi.fn()
    authMocks.subscribeToAuth.mockReturnValue(unsub)
    const { unmount } = renderHook(() => useAuth())
    unmount()
    expect(unsub).toHaveBeenCalled()
  })
})
