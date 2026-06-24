import { useForm } from 'react-hook-form'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { DatePicker } from '../ui/DatePicker'
import { Button } from '../ui/Button'
import { rules } from '../../utils/validation'

/** Create / edit a client. Calls onSubmit with the form values. */
export function ClientForm({ defaultValues = {}, onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="שם מלא" error={errors.name?.message} {...register('name', rules.required)} />
      <Input
        label="טלפון"
        type="tel"
        error={errors.phone?.message}
        {...register('phone', rules.phone)}
      />
      <Input
        label="אימייל"
        type="email"
        error={errors.email?.message}
        {...register('email', {
          validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'אימייל לא תקין',
        })}
      />
      <DatePicker label="תאריך לידה" {...register('birthdate')} />
      <Textarea label="הערות" rows={3} {...register('notes')} />

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

export default ClientForm
