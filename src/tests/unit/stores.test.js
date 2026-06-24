import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'
import { useUiStore } from '../../store/uiStore'

describe('authStore', () => {
  beforeEach(() => useAuthStore.setState({ user: null, loading: true }))

  it('setUser stores the user and clears loading', () => {
    useAuthStore.getState().setUser({ uid: '1' })
    expect(useAuthStore.getState().user).toEqual({ uid: '1' })
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('reset clears the user', () => {
    useAuthStore.getState().setUser({ uid: '1' })
    useAuthStore.getState().reset()
    expect(useAuthStore.getState().user).toBeNull()
  })
})

describe('toastStore', () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }))

  it('addToast appends a toast and returns its id', () => {
    const id = useToastStore.getState().addToast('hi', 'success', 0)
    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0]).toMatchObject({ id, message: 'hi', type: 'success' })
  })

  it('removeToast removes by id', () => {
    const id = useToastStore.getState().addToast('bye', 'info', 0)
    useToastStore.getState().removeToast(id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('auto-removes after the timeout', () => {
    vi.useFakeTimers()
    useToastStore.getState().addToast('temp', 'info', 1000)
    expect(useToastStore.getState().toasts).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(useToastStore.getState().toasts).toHaveLength(0)
    vi.useRealTimers()
  })
})

describe('uiStore', () => {
  beforeEach(() => useUiStore.setState({ sidebarOpen: false }))

  it('toggles the sidebar', () => {
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(true)
  })

  it('open/close set explicit state', () => {
    useUiStore.getState().openSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(true)
    useUiStore.getState().closeSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(false)
  })
})
