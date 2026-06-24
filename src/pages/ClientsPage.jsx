import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCollection } from '../hooks/useCollection'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../hooks/useToast'
import { clientsService, filterClients } from '../services/clients'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ClientForm } from '../components/clients/ClientForm'
import { formatPhone, formatDate } from '../utils/format'

/** Clients list with search + CRUD modals. */
export function ClientsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { items, isLoading, create, update, remove, isMutating } = useCollection(
    'clients',
    clientsService
  )

  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 250)
  const [editing, setEditing] = useState(null) // null | {} (new) | client
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => filterClients(items, debounced), [items, debounced])

  const handleSubmit = async (values) => {
    try {
      if (editing?.id) {
        await update({ id: editing.id, data: values })
        toast.success('הלקוח עודכן')
      } else {
        await create(values)
        toast.success('הלקוח נוסף')
      }
      setEditing(null)
    } catch {
      toast.error('שגיאה בשמירת הלקוח')
    }
  }

  const handleDelete = async () => {
    try {
      await remove(deleting.id)
      toast.success('הלקוח נמחק')
      setDeleting(null)
    } catch {
      toast.error('שגיאה במחיקה')
    }
  }

  const columns = [
    { key: 'name', header: 'שם', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'phone', header: 'טלפון', render: (r) => formatPhone(r.phone) },
    { key: 'email', header: 'אימייל' },
    { key: 'birthdate', header: 'תאריך לידה', render: (r) => formatDate(r.birthdate) },
    {
      key: 'actions',
      header: 'פעולות',
      render: (r) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => setEditing(r)}>
            עריכה
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleting(r)}>
            מחיקה
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-rose-soft">לקוחות</h1>
        <Button onClick={() => setEditing({})}>+ לקוח חדש</Button>
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="חיפוש לפי שם, טלפון או אימייל..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="חיפוש לקוחות"
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="לא נמצאו לקוחות"
        onRowClick={(r) => navigate(`/clients/${r.id}`)}
      />

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'עריכת לקוח' : 'לקוח חדש'}
      >
        {editing !== null && (
          <ClientForm
            defaultValues={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitting={isMutating}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="מחיקת לקוח"
        message={`למחוק את ${deleting?.name}? פעולה זו אינה הפיכה.`}
        confirmLabel="מחק"
        loading={isMutating}
      />
    </div>
  )
}

export default ClientsPage
