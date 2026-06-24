import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastContainer } from './components/ui/Toast'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ClientsPage } from './pages/ClientsPage'
import { ClientDetailPage } from './pages/ClientDetailPage'
import { CalendarPage } from './pages/CalendarPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { PhotosPage } from './pages/PhotosPage'
import { RemindersPage } from './pages/RemindersPage'

/** Root application: auth bootstrap + routing. */
export default function App() {
  // Mount the auth listener once for the whole app.
  useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="reminders" element={<RemindersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}
