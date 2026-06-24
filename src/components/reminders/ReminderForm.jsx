import { useForm } from 'react-hook-form'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { DatePicker } from '../ui/DatePicker'
import { Button } from '../ui/Button'
import { rules } from '../../utils/validation'

/** Create / edit a reminder. */
export function ReminderForm({ defaultValues = {}, clients = [], onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { sent: false, ...defaultValues } })

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }))

  const submit = (values) => {
    const client = clients.find((c) => c.id === values.clientId)
    onSubmit({ ...values, clientName: client?.name || values.clientName || '' })
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
      <Textarea
        label="הודעה"
        rows={3}
        error={errors.message?.message}
        {...register('message', rules.required)}
      />
      <DatePicker
        label="מועד שליחה"
        type="datetime-local"
        error={errors.sendAt?.message}
        {...register('sendAt', rules.required)}
      />

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

export default ReminderForm
