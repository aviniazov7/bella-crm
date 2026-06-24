import { useForm } from 'react-hook-form'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { DatePicker } from '../ui/DatePicker'
import { Button } from '../ui/Button'
import { rules } from '../../utils/validation'
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '../../utils/constants'

const METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
  value,
  label,
}))
const STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}))

/** Create / edit a payment. */
export function PaymentForm({ defaultValues = {}, clients = [], onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { method: 'cash', status: 'paid', ...defaultValues },
  })

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }))

  const submit = (values) => {
    const client = clients.find((c) => c.id === values.clientId)
    onSubmit({
      ...values,
      clientName: client?.name || values.clientName || '',
      amount: Number(values.amount),
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <Select
        label="לקוח"
        placeholder="בחר/י לקוח"
        options={clientOptions}
        error={errors.clientId?.message}
        {...register('clientId', rules.required)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="סכום (₪)"
          type="number"
          min="0"
          error={errors.amount?.message}
          {...register('amount', rules.amount)}
        />
        <DatePicker
          label="תאריך"
          type="date"
          error={errors.date?.message}
          {...register('date', rules.required)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="אמצעי תשלום" options={METHOD_OPTIONS} {...register('method')} />
        <Select label="סטטוס" options={STATUS_OPTIONS} {...register('status')} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="submit" loading={submitting}>
          שמירה
        </Button>
      </div>
    </form>
  )
}

export default PaymentForm
