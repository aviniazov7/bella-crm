import { useMemo, useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useToast } from '../hooks/useToast'
import { paymentsService, totalRevenue } from '../services/payments'
import { clientsService } from '../services/clients'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { StatCard } from '../components/ui/StatCard'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { PaymentForm } from '../components/payments/PaymentForm'
import { formatCurrency, formatDate } from '../utils/format'
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
} from '../utils/constants'

/** Payments ledger with status filter, summary, and CRUD. */
export function PaymentsPage() {
  const toast = useToast()
  const payments = useCollection('payments', paymentsService)
  const clients = useCollection('clients', clientsService)

  const [statusFilter, setStatusFilter] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(
    () => (statusFilter ? payments.items.filter((p) => p.status === statusFilter) : payments.items),
    [payments.items, statusFilter]
  )

  const total = useMemo(() => totalRevenue(filtered), [filtered])

  const handleSubmit = async (values) => {
    try {
      if (editing?.id) {
        await payments.update({ id: editing.id, data: values })
        toast.success('התשלום עודכן')
      } else {
        await payments.create(values)
        toast.success('התשלום נוסף')
      }
      setEditing(null)
    } catch {
      toast.error('שגיאה בשמירת התשלום')
    }
  }

  const handleDelete = async () => {
    try {
      await payments.remove(deleting.id)
      toast.success('התשלום נמחק')
      setDeleting(null)
    } catch {
      toast.error('שגיאה במחיקה')
    }
  }

  const columns = [
    { key: 'clientName', header: 'לקוח' },
    {
      key: 'amount',
      header: 'סכום',
      render: (r) => <span className="font-medium text-gold">{formatCurrency(r.amount)}</span>,
    },
    { key: 'date', header: 'תאריך', render: (r) => formatDate(r.date) },
    { key: 'method', header: 'אמצעי', render: (r) => PAYMENT_METHOD_LABELS[r.method] || r.method },
    {
      key: 'status',
      header: 'סטטוס',
      render: (r) => (
        <Badge variant={PAYMENT_STATUS_VARIANTS[r.status] || 'gold'}>
          {PAYMENT_STATUS_LABELS[r.status] || r.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'פעולות',
      render: (r) => (
        <div className="flex gap-2">
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
        <h1 className="text-2xl font-bold text-rose-soft">תשלומים</h1>
        <Button onClick={() => setEditing({})}>+ תשלום חדש</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="סך הכנסות (מסונן)" value={formatCurrency(total)} icon="💰" />
        <StatCard label="מספר תשלומים" value={filtered.length} icon="🧾" accent="rose" />
      </div>

      <div className="max-w-xs">
        <Select
          label="סינון לפי סטטוס"
          placeholder="כל הסטטוסים"
          options={Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={payments.isLoading}
        emptyMessage="אין תשלומים"
      />

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'עריכת תשלום' : 'תשלום חדש'}
      >
        {editing !== null && (
          <PaymentForm
            defaultValues={editing}
            clients={clients.items}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitting={payments.isMutating}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="מחיקת תשלום"
        message="למחוק את התשלום?"
        confirmLabel="מחק"
        loading={payments.isMutating}
      />
    </div>
  )
}

export default PaymentsPage
