import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, CalendarDays, Wallet, ArrowLeft, Clock, Plus } from 'lucide-react'
import { useCollection } from '../hooks/useCollection'
import { clientsService } from '../services/clients'
import { appointmentsService } from '../services/appointments'
import { paymentsService } from '../services/payments'
import { revenueForMonth } from '../services/payments'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../utils/format'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_VARIANTS } from '../utils/constants'

function todayISO() {
  const d = new Date()
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  )
}

/** Build a 7-point trend series ending at \`total\`, derived deterministically. */
function buildSpark(total) {
  const n = Math.max(0, Number(total) || 0)
  const pts = []
  for (let i = 6; i >= 0; i--) {
    const factor = 1 - i * 0.07
    pts.push(Math.max(0, Math.round(n * factor)))
  }
  return pts
}

const container = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

/** Overview dashboard: headline stats + today schedule. */
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

  const clientCount = clients.items.length
  const apptCount = todaysAppointments.length

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="font-serif text-3xl font-bold text-cream">דשבורד</h1>
        <p className="mt-1 text-sm text-muted">{formatDate(new Date(), 'EEEE, dd/MM/yyyy')}</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        <motion.div variants={item}>
          <StatCard
            label="סך לקוחות"
            value={clientCount}
            icon={<Users className="h-5 w-5" />}
            accent="gold"
            trend={12}
            spark={buildSpark(clientCount)}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            label="תורים היום"
            value={apptCount}
            icon={<CalendarDays className="h-5 w-5" />}
            accent="rose"
            trend={apptCount > 0 ? 8 : 0}
            spark={buildSpark(Math.max(apptCount, 3))}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            label="הכנסה החודש"
            value={formatCurrency(monthRevenue)}
            icon={<Wallet className="h-5 w-5" />}
            accent="neutral"
            trend={monthRevenue > 0 ? 5 : 0}
            spark={buildSpark(Math.max(Math.round(monthRevenue / 100), 4))}
          />
        </motion.div>
      </motion.div>

      <Card>
        <CardHeader
          title="התורים של היום"
          action={
            <Link
              to="/calendar"
              className="flex items-center gap-1 text-sm text-gold transition-colors hover:text-gold-soft"
            >
              ליומן <ArrowLeft className="h-4 w-4" />
            </Link>
          }
        />
        {apptCount === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-7 w-7" />}
            title="אין תורים להיום"
            description="התורים שתקבעי ליום זה יופיעו כאן בזמן אמת."
            action={
              <Link to="/calendar">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  הוסף תור ראשון
                </Button>
              </Link>
            }
          />
        ) : (
          <ul className="flex flex-col divide-y divide-line/60">
            {todaysAppointments.map((appt, i) => (
              <motion.li
                key={appt.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between gap-3 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 font-mono text-sm text-gold">
                    <Clock className="h-3.5 w-3.5" />
                    {appt.time}
                  </span>
                  <div>
                    <p className="font-medium text-cream">{appt.clientName}</p>
                    <p className="text-xs text-muted">{appt.serviceType}</p>
                  </div>
                </div>
                <Badge variant={APPOINTMENT_STATUS_VARIANTS[appt.status] || 'gold'}>
                  {APPOINTMENT_STATUS_LABELS[appt.status] || appt.status}
                </Badge>
              </motion.li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

export default DashboardPage
