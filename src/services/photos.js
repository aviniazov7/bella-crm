/**
 * Photos service — before/after gallery backed by Supabase Storage.
 */
import { supabase } from './supabase'
import { createCollectionService } from './supabaseCrud'

const base = createCollectionService('photos', { defaultOrderBy: 'date' })

export async function uploadPhoto(file, clientId, kind = 'before') {
  const safeName = `${kind}-${Date.now()}-${file.name}`.replace(/\s+/g, '_')
  const path = `photos/${clientId}/${safeName}`
  const { error: uploadError } = await supabase.storage.from('bella-crm').upload(path, file)
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from('bella-crm').getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function deletePhotoFile(path) {
  if (!path) return
  try {
    await supabase.storage.from('bella-crm').remove([path])
  } catch {
    // Non-fatal
  }
}

export const photosService = {
  ...base,
  uploadPhoto,
  deletePhotoFile,
}

export default photosService
