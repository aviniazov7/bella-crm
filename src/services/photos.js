/**
 * Photos service — before/after gallery backed by Firebase Storage.
 * Schema: { clientId, beforeUrl, afterUrl, date, notes }
 */
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'
import { createCollectionService } from './firestoreCrud'

const base = createCollectionService('photos', { defaultOrderBy: 'date' })

/**
 * Upload a single file to Storage under photos/<clientId>/<kind>-<filename>
 * and return its public download URL.
 * @param {File} file
 * @param {string} clientId
 * @param {'before'|'after'} kind
 */
export async function uploadPhoto(file, clientId, kind = 'before') {
  const safeName = `${kind}-${Date.now()}-${file.name}`.replace(/\s+/g, '_')
  const path = `photos/${clientId}/${safeName}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  return { url, path }
}

/** Delete a stored object by its storage path (best-effort). */
export async function deletePhotoFile(path) {
  if (!path) return
  try {
    await deleteObject(storageRef(storage, path))
  } catch {
    // Object may already be gone — non-fatal.
  }
}

export const photosService = {
  ...base,
  uploadPhoto,
  deletePhotoFile,
}

export default photosService
