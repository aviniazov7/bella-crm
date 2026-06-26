import { useMemo, useState } from 'react'
import { Plus, Wallet, Receipt } from 'lucide-react'
import { useCollection } from '../hooks/useCollection'
import { useToast } from '../hooks/useToast'
import { paymentsService, totalRevenue } from '../services/payments'
import { clientsService } from '../services/clients'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { StatCard } from '../components/ui/StatCard'
import { EmptyState } from '../components/ui/EmptyState'
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
    { key: 'date', header: 'תאריך', render: (r) => <span className="text-cream/70">{formatDate(r.date)}</span> },
    { key: 'method', header: 'אמצעי', render: (r) => <span className="text-cream/70">{PAYMENT_METHOD_LABELS[r.method] || r.method}</span> },
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
      className: 'w-px whitespace-nowrap',
      cellClassName: 'w-px whitespace-nowrap',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setEditing(r)}>עריכה</Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleting(r)}>מחיקה</Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold text-cream">תשלומים</h1>
        <Button onClick={() => setEditing({})}><Plus className="h-4 w-4" /> תשלום חדש</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="סך הכנסות (מסונן)" value={formatCurrency(total)} icon={<Wallet className="h-5 w-5" />} accent="gold" />
        <StatCard label="מספר תשלומים" value={filtered.length} icon={<Receipt className="h-5 w-5" />} accent="neutral" />
      </div>

      <div className="max-w-xs">
        <Select
          label="סינון לפי סטטוס"
          placeholder="כל הסטטוסים"
          options={Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden p-0">
        <Table
          columns={columns}
          data={filtered}
          loading={payments.isLoading}
          emptyState={
            <EmptyState
              icon={<Receipt className="h-7 w-7" />}
              title={statusFilter ? 'אין תשלומים בסטטוס זה' : 'עדיין אין תשלומים'}
              description={statusFilter ? 'נסי לבחור סטטוס אחר בסינון.' : 'התשלומים שתתעדי יופיעו כאן עם סיכום הכנסות.'}
              action={!statusFilter && (
                <Button size="sm" onClick={() => setEditing({})}><Plus className="h-4 w-4" />הוסף תשלום ראשון</Button>
              )}
            />
          }
        />
      </Card>

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
        message="האם למחוק את התשלום?"
        confirmLabel="מחיקה"
        loading={payments.isMutating}
      />
    </div>
  )
}

export default PaymentsPage
