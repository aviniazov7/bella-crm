import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../hooks/useCollection'
import { clientsService } from '../services/clients'
import { appointmentsService } from '../services/appointments'
import { paymentsService } from '../services/payments'
import { revenueForMonth } from '../services/payments'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../utils/format'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_VARIANTS } from '../utils/constants'

/** Returns YYYY-MM-DD for today in local time. */
function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}

/** Overview dashboard: headline stats + today's schedule. */
export function DashboardPage() {
  const clients = useCollection('clients', clientsService)
  const appointments = useCollection('appointments', appointmentsService)
  const payments = useCollection('payments', paymentsService)

  const today = todayISO()

  const todaysAppointments = useMemo(
    () =>
      appointments.items
        .filter((a) => a.date === today)
        .sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    [appointments.items, today]
  )

  const monthRevenue = useMemo(() => revenueForMonth(payments.items, new Date()), [payments.items])

  const loading = clients.isLoading || appointments.isLoading || payments.isLoading

  if (loading) return <Spinner size="lg" />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-rose-soft">דשבורד</h1>
        <p className="text-sm text-rose-soft/60">{formatDate(new Date(), 'EEEE, dd/MM/yyyy')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="סך לקוחות" value={clients.items.length} icon="👤" />
        <StatCard label="תורים היום" value={todaysAppointments.length} icon="📅" accent="rose" />
        <StatCard label="הכנסה החודש" value={formatCurrency(monthRevenue)} icon="💰" />
      </div>

      <Card>
        <CardHeader
          title="התורים של היום"
          action={
            <Link to="/calendar" className="text-sm text-gold hover:underline">
              ליומן ←
            </Link>
          }
        />
        {todaysAppointments.length === 0 ? (
          <EmptyState message="אין תורים מתוכננים להיום" icon="🌸" />
        ) : (
          <ul className="flex flex-col divide-y divide-ink-300">
            {todaysAppointments.map((appt) => (
              <li key={appt.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gold">{appt.time}</span>
                  <div>
                    <p className="font-medium text-rose-soft">{appt.clientName}</p>
                    <p className="text-xs text-rose-soft/60">{appt.serviceType}</p>
                  </div>
                </div>
                <Badge variant={APPOINTMENT_STATUS_VARIANTS[appt.status] || 'gold'}>
                  {APPOINTMENT_STATUS_LABELS[appt.status] || appt.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

export default DashboardPage
