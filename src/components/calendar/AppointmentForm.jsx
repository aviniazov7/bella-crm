import { useForm } from 'react-hook-form'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { DatePicker } from '../ui/DatePicker'
import { Button } from '../ui/Button'
import { rules } from '../../utils/validation'
import { SERVICE_TYPES, DURATIONS, APPOINTMENT_STATUS_LABELS } from '../../utils/constants'

const STATUS_OPTIONS = Object.entries(APPOINTMENT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}))

/** Create / edit an appointment. `clients` is the list used to pick the client. */
export function AppointmentForm({
  defaultValues = {},
  clients = [],
  onSubmit,
  onCancel,
  submitting,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { status: 'scheduled', duration: 60, ...defaultValues },
  })

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }))

  // The selected client's name is denormalized onto the appointment for fast lists.
  const submit = (values) => {
    const client = clients.find((c) => c.id === values.clientId)
    onSubmit({
      ...values,
      clientName: client?.name || values.clientName || '',
      duration: Number(values.duration),
      price: Number(values.price) || 0,
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
      <Select
        label="סוג טיפול"
        placeholder="בחר/י טיפול"
        options={SERVICE_TYPES}
        error={errors.serviceType?.message}
        {...register('serviceType', rules.required)}
      />
      <div className="grid grid-cols-2 gap-3">
        <DatePicker
          label="תאריך"
          type="date"
          error={errors.date?.message}
          {...register('date', rules.required)}
        />
        <DatePicker
          label="שעה"
          type="time"
          error={errors.time?.message}
          {...register('time', rules.required)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="משך (דקות)"
          options={DURATIONS.map((d) => ({ value: d, label: `${d} דק׳` }))}
          {...register('duration')}
        />
        <Input label="מחיר (₪)" type="number" min="0" {...register('price')} />
      </div>
      <Select label="סטטוס" options={STATUS_OPTIONS} {...register('status')} />

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

export default AppointmentForm
