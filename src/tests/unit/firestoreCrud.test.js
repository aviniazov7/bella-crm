import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Firebase app bootstrap so importing services never initializes the SDK.
vi.mock('../../services/firebase', () => ({ db: {}, auth: {}, storage: {} }))

// Mock the Firestore SDK surface used by the CRUD factory.
const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ __type: 'collection' })),
  doc: vi.fn((_db, name, id) => ({ __type: 'doc', name, id })),
  addDoc: mocks.addDoc,
  getDoc: mocks.getDoc,
  getDocs: mocks.getDocs,
  updateDoc: mocks.updateDoc,
  deleteDoc: mocks.deleteDoc,
  onSnapshot: vi.fn(() => () => {}),
  query: vi.fn((ref) => ref),
  orderBy: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(() => 'TS'),
}))

import { createCollectionService, mapDoc } from '../../services/firestoreCrud'

const service = createCollectionService('widgets')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('mapDoc', () => {
  it('merges id with document data', () => {
    expect(mapDoc({ id: 'x1', data: () => ({ a: 1 }) })).toEqual({ id: 'x1', a: 1 })
  })
})

describe('createCollectionService', () => {
  it('list() maps all docs', async () => {
    mocks.getDocs.mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ name: 'A' }) },
        { id: '2', data: () => ({ name: 'B' }) },
      ],
    })
    const result = await service.list()
    expect(result).toEqual([
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ])
  })

  it('get() returns null for a missing doc', async () => {
    mocks.getDoc.mockResolvedValue({ exists: () => false })
    expect(await service.get('missing')).toBeNull()
  })

  it('get() returns the mapped doc when it exists', async () => {
    mocks.getDoc.mockResolvedValue({
      id: '7',
      exists: () => true,
      data: () => ({ name: 'Z' }),
    })
    expect(await service.get('7')).toEqual({ id: '7', name: 'Z' })
  })

  it('create() stamps timestamps and returns the new id', async () => {
    mocks.addDoc.mockResolvedValue({ id: 'new1' })
    const result = await service.create({ name: 'New' })
    expect(result).toEqual({ id: 'new1', name: 'New' })
    expect(mocks.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'New', createdAt: 'TS', updatedAt: 'TS' })
    )
  })

  it('update() patches and returns the id', async () => {
    mocks.updateDoc.mockResolvedValue()
    const result = await service.update('5', { name: 'Edited' })
    expect(result).toEqual({ id: '5', name: 'Edited' })
    expect(mocks.updateDoc).toHaveBeenCalled()
  })

  it('remove() deletes and returns the id', async () => {
    mocks.deleteDoc.mockResolvedValue()
    expect(await service.remove('9')).toBe('9')
    expect(mocks.deleteDoc).toHaveBeenCalled()
  })
})
