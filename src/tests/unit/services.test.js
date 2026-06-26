import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../services/supabase', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
    removeChannel: vi.fn(),
  },
}))

import { filterClients, clientsService } from '../../services/clients'
import { toCalendarEvents, APPOINTMENT_STATUSES } from '../../services/appointments'
import { totalRevenue, revenueForMonth, PAYMENT_METHODS, PAYMENT_STATUSES } from '../../services/payments'
import { pendingReminders } from '../../services/reminders'

describe('clientsService.filterClients', () => {
  const clients = [
    { name: 'Alice', phone: '050', email: 'a@a.com' },
    { name: 'Bob', phone: '052', email: 'b@b.com' },
  ]
  it('returns all for empty term', () => {
    expect(filterClients(clients, '')).toEqual(clients)
  })
  it('filters by name', () => {
    expect(filterClients(clients, 'alice')).toHaveLength(1)
  })
  it('filters by phone', () => {
    expect(filterClients(clients, '052')).toHaveLength(1)
  })
})

describe('appointmentsService.toCalendarEvents', () => {
  it('maps to calendar events', () => {
    const appts = [{ id: '1', date: '2024-01-15', time: '10:00', duration: 60, client_name: 'Alice', service_type: 'Haircut' }]
    const events = toCalendarEvents(appts)
    expect(events[0].title).toContain('Alice')
    expect(events[0].start).toBeInstanceOf(Date)
  })
})

describe('paymentsService.totalRevenue', () => {
  it('sums paid payments', () => {
    const payments = [
      { amount: 100, status: 'paid' },
      { amount: 50, status: 'pending' },
      { amount: 75, status: 'paid' },
    ]
    expect(totalRevenue(payments)).toBe(175)
  })
})

describe('paymentsService.revenueForMonth', () => {
  it('sums paid payments for current month', () => {
    const now = new Date()
    const payments = [
      { amount: 100, status: 'paid', date: now.toISOString().split('T')[0] },
      { amount: 50, status: 'paid', date: '2020-01-01' },
    ]
    expect(revenueForMonth(payments, now)).toBe(100)
  })
})

describe('remindersService.pendingReminders', () => {
  it('returns unsent past reminders', () => {
    const now = new Date()
    const past = new Date(now - 1000).toISOString()
    const future = new Date(now.getTime() + 100000).toISOString()
    const reminders = [
      { id: '1', sent: false, send_at: past },
      { id: '2', sent: true, send_at: past },
      { id: '3', sent: false, send_at: future },
    ]
    expect(pendingReminders(reminders, now)).toHaveLength(1)
    expect(pendingReminders(reminders, now)[0].id).toBe('1')
  })
})
