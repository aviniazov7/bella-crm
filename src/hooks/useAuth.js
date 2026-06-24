/**
 * useAuth — subscribes to Firebase auth state and mirrors it into the auth store.
 * Mount this once near the app root.
 */
import { useEffect } from 'react'
import { subscribeToAuth } from '../services/auth'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, loading, setUser } = useAuthStore()

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => setUser(u))
    return unsubscribe
  }, [setUser])

  return { user, loading, isAuthenticated: !!user }
}

export default useAuth
