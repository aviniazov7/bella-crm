import { describe, it, expect, vi, beforeEach } from 'vitest'

const supabaseMock = vi.hoisted(() => ({
  from: vi.fn(),
  channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
  removeChannel: vi.fn(),
}))

vi.mock('../../services/supabase', () => ({ supabase: supabaseMock }))

import { createCollectionService } from '../../services/supabaseCrud'

const service = createCollectionService('widgets')

beforeEach(() => {
  vi.clearAllMocks()
  supabaseMock.channel.mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })
})

describe('createCollectionService', () => {
  it('list() maps all docs', async () => {
    supabaseMock.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          { id: '1', name: 'A' },
          { id: '2', name: 'B' },
        ],
        error: null,
      }),
    })
    const result = await service.list()
    expect(result).toEqual([
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ])
  })

  it('get() returns null for missing doc', async () => {
    supabaseMock.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    })
    expect(await service.get('missing')).toBeNull()
  })

  it('get() returns doc when exists', async () => {
    supabaseMock.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '7', name: 'Z' }, error: null }),
    })
    expect(await service.get('7')).toEqual({ id: '7', name: 'Z' })
  })

  it('create() returns new doc', async () => {
    supabaseMock.from.mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'new1', name: 'New' }, error: null }),
    })
    const result = await service.create({ name: 'New' })
    expect(result).toEqual({ id: 'new1', name: 'New' })
  })

  it('update() returns updated doc', async () => {
    supabaseMock.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '5', name: 'Edited' }, error: null }),
    })
    expect(await service.update('5', { name: 'Edited' })).toEqual({ id: '5', name: 'Edited' })
  })

  it('remove() returns the id', async () => {
    supabaseMock.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    })
    expect(await service.remove('9')).toBe('9')
  })
})
