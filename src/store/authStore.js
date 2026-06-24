/**
 * Auth store — holds the current Firebase user and loading state.
 * The actual auth subscription is wired up in useAuth().
 */
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, loading: false }),
}))

export default useAuthStore
