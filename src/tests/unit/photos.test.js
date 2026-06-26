import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../services/supabase', () => ({
  supabase: {
    from: vi.fn(),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/photo.jpg' } })),
        remove: vi.fn().mockResolvedValue({ error: null }),
      })),
    },
    channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
    removeChannel: vi.fn(),
  },
}))

import { uploadPhoto, deletePhotoFile } from '../../services/photos'

beforeEach(() => vi.clearAllMocks())

describe('uploadPhoto', () => {
  it('uploads and returns url', async () => {
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' })
    const result = await uploadPhoto(file, 'client1', 'before')
    expect(result.url).toBe('https://example.com/photo.jpg')
    expect(result.path).toContain('photos/client1/before-')
  })
})

describe('deletePhotoFile', () => {
  it('does nothing for empty path', async () => {
    await expect(deletePhotoFile('')).resolves.toBeUndefined()
    await expect(deletePhotoFile(null)).resolves.toBeUndefined()
  })
})
