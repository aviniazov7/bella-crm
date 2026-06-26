import { useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { he } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCollection } from '../hooks/useCollection'
import { appointmentsService, toCalendarEvents } from '../services/appointments'
import { clientsService } from '../services/clients'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { AppointmentForm } from '../components/calendar/AppointmentForm'

const locales = { he }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

const messages = {
  today: 'היום',
  previous: 'הקודם',
  next: 'הבא',
  month: 'חודש',
  week: 'שבוע',
  day: 'יום',
  agenda: 'סדר יום',
  date: 'תאריך',
  time: 'שעה',
  event: 'אירוע',
  noEventsInRange: 'אין תורים בטווח זה',
}

const MIN_TIME = new Date(1970, 0, 1, 7, 0, 0)
const MAX_TIME = new Date(1970, 0, 1, 21, 0, 0)
const SCROLL_TO = new Date(1970, 0, 1, 8, 0, 0)

/** Appointment calendar with month/week/day views. */
export function CalendarPage() {
  const toast = useToast()
  const appointments = useCollection('appointments', appointmentsService)
  const clients = useCollection('clients', clientsService)

  const [editing, setEditing] = useState(null)

  const events = useMemo(() => toCalendarEvents(appointments.items), [appointments.items])

  const handleSubmit = async (values) => {
    try {
      if (editing?.id) {
        await appointments.update({ id: editing.id, data: values })
        toast.success('התור עודכן')
      } else {
        await appointments.create(values)
        toast.success('התור נקבע')
      }
      setEditing(null)
    } catch {
      toast.error('שגיאה בשמירת התור')
    }
  }

  const handleSelectSlot = ({ start }) => {
    const date = format(start, 'yyyy-MM-dd')
    const time = format(start, 'HH:mm')
    setEditing({ date, time })
  }

  if (appointments.isLoading) return <Spinner size="lg" />

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold text-cream">יומן תורים</h1>
        <Button onClick={() => setEditing({})}><Plus className="h-4 w-4" /> תור חדש</Button>
      </div>

      <Card className="h-[72vh] p-3 sm:p-5">
        <Calendar
          localizer={localizer}
          culture="he"
          rtl
          events={events}
          messages={messages}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']}
          defaultView="week"
          min={MIN_TIME}
          max={MAX_TIME}
          scrollToTime={SCROLL_TO}
          step={30}
          timeslots={2}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(ev) => setEditing(ev.resource)}
          style={{ height: '100%' }}
        />
      </Card>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'עריכת תור' : 'תור חדש'}
      >
        {editing !== null && (
          <AppointmentForm
            defaultValues={editing}
            clients={clients.items}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitting={appointments.isMutating}
          />
        )}
      </Modal>
    </div>
  )
}

export default CalendarPage
