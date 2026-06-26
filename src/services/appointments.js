/**
 * Appointments service.
 */
import { supabase } from './supabase'
import { createCollectionService } from './supabaseCrud'

const base = createCollectionService('appointments', { defaultOrderBy: 'date' })

export const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled', 'no-show']

async function listByClient(clientId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export function toCalendarEvents(appointments) {
  return appointments.map((appt) => {
    const start = new Date(`${appt.date}T${appt.time || '00:00'}`)
    const end = new Date(start.getTime() + (Number(appt.duration) || 60) * 60000)
    return {
      id: appt.id,
      title: `${appt.client_name || appt.clientName || 'לקוח'} · ${appt.service_type || appt.serviceType || ''}`.trim(),
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
