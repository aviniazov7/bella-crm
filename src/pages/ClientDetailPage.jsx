import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { clientsService } from '../services/clients'
import { appointmentsService } from '../services/appointments'
import { paymentsService } from '../services/payments'
import { photosService } from '../services/photos'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatPhone, formatDate, formatCurrency, initials } from '../utils/format'
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_VARIANTS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
} from '../utils/constants'

/** Full client profile: details, appointment history, payments, photos. */
export function ClientDetailPage() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [payments, setPayments] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const [c, a, p, ph] = await Promise.all([
        clientsService.get(id),
        appointmentsService.listByClient(id),
        paymentsService.listByClient(id),
        photosService.list().then((all) => all.filter((x) => x.clientId === id)),
      ])
      if (!active) return
      setClient(c)
      setAppointments(a)
      setPayments(p)
      setPhotos(ph)
      setLoading(false)
    }
    load().catch(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  if (loading) return <Spinner size="lg" />

  if (!client) {
    return (
      <EmptyState
        message="הלקוח לא נמצא"
        action={
          <Link to="/clients" className="text-gold hover:underline">
            חזרה לרשימה
          </Link>
        }
      />
    )
  }

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + (Number(p.amount) || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/clients" className="text-sm text-gold hover:underline">
        → חזרה ללקוחות
      </Link>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose to-gold text-xl font-bold text-ink">
          {initials(client.name)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-rose-soft">{client.name}</h1>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-rose-soft/70">
            <span>📞 {formatPhone(client.phone)}</span>
            {client.email && <span>✉ {client.email}</span>}
            {client.birthdate && <span>🎂 {formatDate(client.birthdate)}</span>}
          </div>
        </div>
        <div className="text-left">
          <p className="text-xs text-rose-soft/60">סה״כ שולם</p>
          <p className="text-xl font-bold text-gold">{formatCurrency(totalPaid)}</p>
        </div>
      </Card>

      {client.notes && (
        <Card>
          <CardHeader title="הערות" />
          <p className="whitespace-pre-wrap text-sm text-rose-soft/80">{client.notes}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="היסטוריית תורים" />
          {appointments.length === 0 ? (
            <EmptyState message="אין תורים" />
          ) : (
            <ul className="flex flex-col divide-y divide-ink-300">
              {appointments.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="text-rose-soft">{a.serviceType}</p>
                    <p className="text-xs text-rose-soft/60">
                      {formatDate(a.date)} {a.time}
                    </p>
                  </div>
                  <Badge variant={APPOINTMENT_STATUS_VARIANTS[a.status] || 'gold'}>
                    {APPOINTMENT_STATUS_LABELS[a.status] || a.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="תשלומים" />
          {payments.length === 0 ? (
            <EmptyState message="אין תשלומים" />
          ) : (
            <ul className="flex flex-col divide-y divide-ink-300">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-gold">{formatCurrency(p.amount)}</p>
                    <p className="text-xs text-rose-soft/60">{formatDate(p.date)}</p>
                  </div>
                  <Badge variant={PAYMENT_STATUS_VARIANTS[p.status] || 'gold'}>
                    {PAYMENT_STATUS_LABELS[p.status] || p.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader title="תמונות לפני / אחרי" />
        {photos.length === 0 ? (
          <EmptyState message="אין תמונות" icon="🖼" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((ph) => (
              <div key={ph.id} className="overflow-hidden rounded-xl border border-ink-300">
                <div className="grid grid-cols-2">
                  {ph.beforeUrl ? (
                    <img src={ph.beforeUrl} alt="לפני" className="aspect-square object-cover" />
                  ) : (
                    <div className="aspect-square bg-ink-200" />
                  )}
                  {ph.afterUrl ? (
                    <img src={ph.afterUrl} alt="אחרי" className="aspect-square object-cover" />
                  ) : (
                    <div className="aspect-square bg-ink-200" />
                  )}
                </div>
                <p className="px-2 py-1 text-xs text-rose-soft/60">{formatDate(ph.date)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default ClientDetailPage
