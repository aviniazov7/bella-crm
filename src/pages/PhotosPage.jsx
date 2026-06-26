import { useState, useEffect } from 'react'
import { Plus, ImageIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useCollection } from '../hooks/useCollection'
import { supabase } from '../services/supabase'
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

  // Storage usage: sum object sizes in the photos folder of the bucket (0 if missing).
  const [storageBytes, setStorageBytes] = useState(0)
  useEffect(() => {
    let cancelled = false
    async function loadUsage() {
      try {
        const { data: clientFolders, error } = await supabase.storage
          .from('bella-crm')
          .list('photos', { limit: 1000 })
        if (error || !clientFolders) return
        let total = 0
        for (const folder of clientFolders) {
          const { data: files } = await supabase.storage
            .from('bella-crm')
            .list('photos/' + folder.name, { limit: 1000 })
          for (const file of files || []) {
            total += file?.metadata?.size || 0
          }
        }
        if (!cancelled) setStorageBytes(total)
      } catch {
        /* bucket missing or no access -> keep 0 */
      }
    }
    loadUsage()
    return () => {
      cancelled = true
    }
  }, [photos.items.length])

  const formatStorage = (bytes) => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + 'KB'
    return bytes + 'B'
  }

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
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl font-bold text-cream">תמונות לפני / אחרי</h1>
          <p className="text-xs text-muted">
            אחסון תמונות: {formatStorage(storageBytes)} מתוך 1GB · עד 50MB לתמונה
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> העלאת תמונות
        </Button>
      </div>

      {photos.isLoading ? (
        <Spinner size="lg" />
      ) : photos.items.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-7 w-7" />}
          title="עדיין אין תמונות בגלריה"
          description="העלי תמונות לפני ואחרי כדי לתעד את התוצאות של הלקוחות."
          action={
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              העלאת תמונה ראשונה
            </Button>
          }
        />
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
