/**
 * Appointments service.
 * Schema: { clientId, clientName, serviceType, date, time, duration, price, status }
 * status ∈ 'scheduled' | 'completed' | 'cancelled' | 'no-show'
 */
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { createCollectionService, mapDoc } from './firestoreCrud'

const base = createCollectionService('appointments', { defaultOrderBy: 'date' })

export const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled', 'no-show']

/** Fetch every appointment for a given client. */
async function listByClient(clientId) {
  const q = query(
    collection(db, 'appointments'),
    where('clientId', '==', clientId),
    orderBy('date', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapDoc)
}

/**
 * Map appointment records into react-big-calendar events.
 * Each event needs a JS Date `start` and `end` derived from date + time + duration.
 */
export function toCalendarEvents(appointments) {
  return appointments.map((appt) => {
    const start = new Date(`${appt.date}T${appt.time || '00:00'}`)
    const end = new Date(start.getTime() + (Number(appt.duration) || 60) * 60000)
    return {
      id: appt.id,
      title: `${appt.clientName || 'לקוח'} · ${appt.serviceType || ''}`.trim(),
      start,
      end,
      resource: appt,
    }
  })
}

export const appointmentsService = {
  ...base,
  listByClient,
  toCalendarEvents,
  STATUSES: APPOINTMENT_STATUSES,
}

export default appointmentsService
