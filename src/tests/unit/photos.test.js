import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../services/firebase', () => ({ db: {}, auth: {}, storage: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(),
}))

const storageMocks = vi.hoisted(() => ({
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
}))

vi.mock('firebase/storage', () => ({
  ref: vi.fn((_s, path) => ({ path })),
  uploadBytes: storageMocks.uploadBytes,
  getDownloadURL: storageMocks.getDownloadURL,
  deleteObject: storageMocks.deleteObject,
}))

import { uploadPhoto, deletePhotoFile } from '../../services/photos'

beforeEach(() => vi.clearAllMocks())

describe('uploadPhoto', () => {
  it('uploads the file and returns the download url + path', async () => {
    storageMocks.uploadBytes.mockResolvedValue({})
    storageMocks.getDownloadURL.mockResolvedValue('https://cdn/img.jpg')
    const file = { name: 'pic.jpg' }
    const result = await uploadPhoto(file, 'client1', 'before')
    expect(result.url).toBe('https://cdn/img.jpg')
    expect(result.path).toContain('photos/client1/before-')
    expect(storageMocks.uploadBytes).toHaveBeenCalledOnce()
  })
})

describe('deletePhotoFile', () => {
  it('does nothing when no path is given', async () => {
    await deletePhotoFile('')
    expect(storageMocks.deleteObject).not.toHaveBeenCalled()
  })

  it('swallows errors from a missing object', async () => {
    storageMocks.deleteObject.mockRejectedValue(new Error('not found'))
    await expect(deletePhotoFile('photos/x/y.jpg')).resolves.toBeUndefined()
  })
})
