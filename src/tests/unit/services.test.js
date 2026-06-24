import { describe, it, expect, vi } from 'vitest'

// Avoid initializing the real Firebase SDK; the pure helpers under test don't need it.
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

import { filterClients } from '../../services/clients'
import { totalRevenue, revenueForMonth } from '../../services/payments'
import { toCalendarEvents } from '../../services/appointments'
import { pendingReminders } from '../../services/reminders'

describe('filterClients', () => {
  const clients = [
    { name: 'בלה כהן', phone: '0501112222', email: 'bella@x.com' },
    { name: 'דנה לוי', phone: '0523334444', email: 'dana@y.com' },
  ]
  it('returns all when term is empty', () => {
    expect(filterClients(clients, '')).toHaveLength(2)
  })
  it('matches by name', () => {
    expect(filterClients(clients, 'דנה')).toHaveLength(1)
  })
  it('matches by phone fragment', () => {
    expect(filterClients(clients, '1112')).toHaveLength(1)
  })
  it('is case-insensitive on email', () => {
    expect(filterClients(clients, 'BELLA')).toHaveLength(1)
  })
})

describe('payments calculations', () => {
  const payments = [
    { amount: 100, status: 'paid', date: '2026-06-10' },
    { amount: 50, status: 'pending', date: '2026-06-12' },
    { amount: 200, status: 'paid', date: '2026-05-01' },
  ]
  it('totalRevenue sums only paid payments', () => {
    expect(totalRevenue(payments)).toBe(300)
  })
  it('revenueForMonth restricts to the given month', () => {
    expect(revenueForMonth(payments, new Date('2026-06-15'))).toBe(100)
  })
})

describe('toCalendarEvents', () => {
  it('builds start/end Dates from date + time + duration', () => {
    const events = toCalendarEvents([
      {
        id: 'a1',
        clientName: 'בלה',
        serviceType: 'מניקור',
        date: '2026-06-24',
        time: '10:00',
        duration: 90,
      },
    ])
    expect(events).toHaveLength(1)
    expect(events[0].start.getHours()).toBe(10)
    expect((events[0].end - events[0].start) / 60000).toBe(90)
    expect(events[0].title).toContain('בלה')
  })

  it('defaults duration to 60 minutes', () => {
    const [ev] = toCalendarEvents([{ id: 'a2', date: '2026-06-24', time: '09:00' }])
    expect((ev.end - ev.start) / 60000).toBe(60)
  })
})

describe('pendingReminders', () => {
  const now = new Date('2026-06-24T12:00:00')
  it('returns unsent reminders whose time has passed', () => {
    const list = [
      { sent: false, sendAt: '2026-06-24T10:00:00' },
      { sent: true, sendAt: '2026-06-24T10:00:00' },
      { sent: false, sendAt: '2026-06-25T10:00:00' },
    ]
    expect(pendingReminders(list, now)).toHaveLength(1)
  })
})
