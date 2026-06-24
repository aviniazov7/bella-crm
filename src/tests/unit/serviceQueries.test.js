import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../services/firebase', () => ({ db: {}, auth: {}, storage: {} }))

const mocks = vi.hoisted(() => ({
  getDocs: vi.fn(),
  onSnapshot: vi.fn(),
  updateDoc: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  addDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: mocks.getDocs,
  updateDoc: mocks.updateDoc,
  deleteDoc: vi.fn(),
  onSnapshot: mocks.onSnapshot,
  query: vi.fn((ref) => ref),
  orderBy: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(() => 'TS'),
}))

import { appointmentsService } from '../../services/appointments'
import { paymentsService } from '../../services/payments'
import { remindersService } from '../../services/reminders'
import { clientsService } from '../../services/clients'

beforeEach(() => vi.clearAllMocks())

const docsFor = (rows) => ({ docs: rows.map((r) => ({ id: r.id, data: () => r })) })

describe('listByClient queries', () => {
  it('appointments.listByClient maps results', async () => {
    mocks.getDocs.mockResolvedValue(docsFor([{ id: 'a1', clientId: 'c1' }]))
    expect(await appointmentsService.listByClient('c1')).toEqual([{ id: 'a1', clientId: 'c1' }])
  })

  it('payments.listByClient maps results', async () => {
    mocks.getDocs.mockResolvedValue(docsFor([{ id: 'p1', clientId: 'c1' }]))
    expect(await paymentsService.listByClient('c1')).toEqual([{ id: 'p1', clientId: 'c1' }])
  })

  it('reminders.listByClient maps results', async () => {
    mocks.getDocs.mockResolvedValue(docsFor([{ id: 'r1', clientId: 'c1' }]))
    expect(await remindersService.listByClient('c1')).toEqual([{ id: 'r1', clientId: 'c1' }])
  })
})

describe('reminders.markSent', () => {
  it('updates the reminder to sent', async () => {
    mocks.updateDoc.mockResolvedValue()
    const result = await remindersService.markSent('r1')
    expect(result).toEqual({ id: 'r1', sent: true })
    expect(mocks.updateDoc).toHaveBeenCalled()
  })
})

describe('subscribe', () => {
  it('forwards mapped snapshot docs to the callback', () => {
    mocks.onSnapshot.mockImplementation((_q, onNext) => {
      onNext(docsFor([{ id: 'c1', name: 'A' }]))
      return () => 'unsub'
    })
    const cb = vi.fn()
    const unsub = clientsService.subscribe(cb)
    expect(cb).toHaveBeenCalledWith([{ id: 'c1', name: 'A' }])
    expect(typeof unsub).toBe('function')
  })

  it('forwards errors to the error handler', () => {
    mocks.onSnapshot.mockImplementation((_q, _onNext, onErr) => {
      onErr(new Error('boom'))
      return () => {}
    })
    const onError = vi.fn()
    clientsService.subscribe(vi.fn(), onError)
    expect(onError).toHaveBeenCalled()
  })
})
