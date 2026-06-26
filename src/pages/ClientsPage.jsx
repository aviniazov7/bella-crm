import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react'
import { useCollection } from '../hooks/useCollection'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../hooks/useToast'
import { clientsService, filterClients } from '../services/clients'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ClientForm } from '../components/clients/ClientForm'
import { formatPhone, formatDate } from '../utils/format'

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

function Avatar({ name }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold text-cream/80 ring-1 ring-line">
      {initials(name)}
    </span>
  )
}

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
  const [editing, setEditing] = useState(null)
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
    {
      key: 'name',
      header: 'שם',
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} />
          <span className="font-medium text-cream">{r.name}</span>
        </div>
      ),
    },
    { key: 'phone', header: 'טלפון', render: (r) => formatPhone(r.phone) },
    {
      key: 'email',
      header: 'אימייל',
      render: (r) => <span className="text-cream/70">{r.email || '—'}</span>,
    },
    {
      key: 'birthdate',
      header: 'תאריך לידה',
      render: (r) => <span className="text-cream/70">{formatDate(r.birthdate) || '—'}</span>,
    },
    {
      key: 'actions',
      header: 'פעולות',
      className: 'w-px whitespace-nowrap',
      cellClassName: 'w-px whitespace-nowrap',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => setEditing(r)} aria-label="עריכה">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleting(r)} aria-label="מחיקה">
            <Trash2 className="h-4 w-4 text-rose" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream">לקוחות</h1>
          <p className="mt-1 text-sm text-muted">{items.length} לקוחות פעילים</p>
        </div>
        <Button onClick={() => setEditing({})}>
          <Plus className="h-4 w-4" /> לקוח חדש
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="חיפוש לפי שם, טלפון או אימייל..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="חיפוש לקוחות"
          className="pr-9"
        />
      </div>

      <Card className="overflow-hidden p-0">
        <Table
          columns={columns}
          data={filtered}
          loading={isLoading}
          onRowClick={(r) => navigate('/clients/' + r.id)}
          emptyState={
            <EmptyState
              icon={<Users className="h-7 w-7" />}
              title={debounced ? 'לא נמצאו לקוחות' : 'עדיין אין לקוחות'}
              description={
                debounced
                  ? 'נסי לחפש בשם, טלפון או אימייל אחר.'
                  : 'הלקוחות שתוסיפי ינוהלו כאן במקום אחד.'
              }
              action={
                !debounced && (
                  <Button size="sm" onClick={() => setEditing({})}>
                    <Plus className="h-4 w-4" />
                    הוסף לקוח ראשון
                  </Button>
                )
              }
            />
          }
        />
      </Card>

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
            loading={isMutating}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="מחיקת לקוח"
        message={'האם למחוק את ' + (deleting?.name || '') + '?'}
        confirmLabel="מחיקה"
        loading={isMutating}
      />
    </div>
  )
}

export default ClientsPage
