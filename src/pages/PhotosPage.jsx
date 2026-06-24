import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCollection } from '../hooks/useCollection'
import { useToast } from '../hooks/useToast'
import { photosService, uploadPhoto } from '../services/photos'
import { clientsService } from '../services/clients'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { DatePicker } from '../components/ui/DatePicker'
import { Textarea } from '../components/ui/Textarea'
import { Modal } from '../components/ui/Modal'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { PhotoUpload } from '../components/photos/PhotoUpload'
import { rules } from '../utils/validation'
import { formatDate } from '../utils/format'

/** Before/after photo gallery with Firebase Storage uploads. */
export function PhotosPage() {
  const toast = useToast()
  const photos = useCollection('photos', photosService)
  const clients = useCollection('clients', clientsService)

  const [open, setOpen] = useState(false)
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile, setAfterFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const close = () => {
    setOpen(false)
    setBeforeFile(null)
    setAfterFile(null)
    reset()
  }

  const onSubmit = async (values) => {
    setUploading(true)
    try {
      const [before, after] = await Promise.all([
        beforeFile ? uploadPhoto(beforeFile, values.clientId, 'before') : null,
        afterFile ? uploadPhoto(afterFile, values.clientId, 'after') : null,
      ])
      const client = clients.items.find((c) => c.id === values.clientId)
      await photos.create({
        clientId: values.clientId,
        clientName: client?.name || '',
        beforeUrl: before?.url || '',
        beforePath: before?.path || '',
        afterUrl: after?.url || '',
        afterPath: after?.path || '',
        date: values.date,
        notes: values.notes || '',
      })
      toast.success('התמונות נשמרו')
      close()
    } catch {
      toast.error('שגיאה בהעלאת התמונות')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-rose-soft">תמונות לפני / אחרי</h1>
        <Button onClick={() => setOpen(true)}>+ העלאת תמונות</Button>
      </div>

      {photos.isLoading ? (
        <Spinner size="lg" />
      ) : photos.items.length === 0 ? (
        <EmptyState message="עדיין אין תמונות בגלריה" icon="🖼" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.items.map((ph) => (
            <Card key={ph.id} className="p-3">
              <div className="grid grid-cols-2 gap-2">
                <figure>
                  <img
                    src={ph.beforeUrl || ''}
                    alt={`לפני - ${ph.clientName}`}
                    className="aspect-square w-full rounded-lg bg-ink-200 object-cover"
                  />
                  <figcaption className="mt-1 text-center text-xs text-rose-soft/60">
                    לפני
                  </figcaption>
                </figure>
                <figure>
                  <img
                    src={ph.afterUrl || ''}
                    alt={`אחרי - ${ph.clientName}`}
                    className="aspect-square w-full rounded-lg bg-ink-200 object-cover"
                  />
                  <figcaption className="mt-1 text-center text-xs text-rose-soft/60">
                    אחרי
                  </figcaption>
                </figure>
              </div>
              <div className="mt-3">
                <p className="font-medium text-rose-soft">{ph.clientName}</p>
                <p className="text-xs text-rose-soft/60">{formatDate(ph.date)}</p>
                {ph.notes && <p className="mt-1 text-sm text-rose-soft/70">{ph.notes}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={close} title="העלאת תמונות">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Select
            label="לקוח"
            placeholder="בחר/י לקוח"
            options={clients.items.map((c) => ({ value: c.id, label: c.name }))}
            error={errors.clientId?.message}
            {...register('clientId', rules.required)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-rose">לפני</p>
              <PhotoUpload label="תמונת לפני" onSelect={setBeforeFile} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-rose">אחרי</p>
              <PhotoUpload label="תמונת אחרי" onSelect={setAfterFile} />
            </div>
          </div>
          <DatePicker
            label="תאריך"
            type="date"
            error={errors.date?.message}
            {...register('date', rules.required)}
          />
          <Textarea label="הערות" rows={2} {...register('notes')} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={close}>
              ביטול
            </Button>
            <Button type="submit" loading={uploading}>
              שמירה
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PhotosPage
