import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Spinner } from './ui/Spinner'

/** Guards routes that require an authenticated user. */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
