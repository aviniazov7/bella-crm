import { useState } from 'react'
import { Plus, BellRing } from 'lucide-react'
import { useCollection } from '../hooks/useCollection'
import { useToast } from '../hooks/useToast'
import { remindersService } from '../services/reminders'
import { clientsService } from '../services/clients'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ReminderForm } from '../components/reminders/ReminderForm'
import { formatDateTime } from '../utils/format'

/** Reminder list with create + mark-as-sent + delete. */
export function RemindersPage() {
  const toast = useToast()
  const reminders = useCollection('reminders', remindersService)
  const clients = useCollection('clients', clientsService)

  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleSubmit = async (values) => {
    try {
      await reminders.create(values)
      toast.success('התזכורת נוספה')
      setOpen(false)
    } catch {
      toast.error('שגיאה בשמירת התזכורת')
    }
  }

  const markSent = async (reminder) => {
    try {
      await reminders.update({ id: reminder.id, data: { sent: true } })
      toast.success('סומן כנשלח')
    } catch {
      toast.error('שגיאה בעדכון')
    }
  }

  const handleDelete = async () => {
    try {
      await reminders.remove(deleting.id)
      toast.success('התזכורת נמחקה')
      setDeleting(null)
    } catch {
      toast.error('שגיאה במחיקה')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold text-cream">תזכורות</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> תזכורת חדשה
        </Button>
      </div>

      {reminders.isLoading ? (
        <Spinner size="lg" />
      ) : reminders.items.length === 0 ? (
        <EmptyState
          icon={<BellRing className="h-7 w-7" />}
          title="אין תזכורות פעילות"
          description="צרי תזכורות למעקב אחר לקוחות, ימי הולדת ותורים חוזרים."
          action={
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              הוסף תזכורת ראשונה
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reminders.items.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-rose-soft">{r.clientName || 'לקוח'}</p>
                  {r.sent ? (
                    <Badge variant="green">נשלח</Badge>
                  ) : (
                    <Badge variant="gold">ממתין</Badge>
                  )}
                </div>
                <p className="truncate text-sm text-rose-soft/80">{r.message}</p>
                <p className="text-xs text-rose-soft/60">{formatDateTime(r.sendAt)}</p>
              </div>
              <div className="flex gap-2">
                {!r.sent && (
                  <Button size="sm" variant="secondary" onClick={() => markSent(r)}>
                    סמן כנשלח
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setDeleting(r)}>
                  מחיקה
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="תזכורת חדשה">
        {open && (
          <ReminderForm
            clients={clients.items}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            submitting={reminders.isMutating}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="מחיקת תזכורת"
        message="למחוק את התזכורת?"
        confirmLabel="מחק"
        loading={reminders.isMutating}
      />
    </div>
  )
}

export default RemindersPage
