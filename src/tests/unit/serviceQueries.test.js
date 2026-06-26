import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../services/supabase', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
    removeChannel: vi.fn(),
  },
}))

import { appointmentsService } from '../../services/appointments'
import { paymentsService } from '../../services/payments'
import { remindersService } from '../../services/reminders'

const mockFrom = (data) => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockResolvedValue({ data, error: null }),
})

describe('appointmentsService.listByClient', () => {
  it('fetches appointments for a client', async () => {
    const { supabase } = await import('../../services/supabase')
    const mockData = [{ id: '1', client_id: 'c1', date: '2024-01-15' }]
    supabase.from.mockReturnValue(mockFrom(mockData))
    const result = await appointmentsService.listByClient('c1')
    expect(result).toEqual(mockData)
  })
})

describe('paymentsService.listByClient', () => {
  it('fetches payments for a client', async () => {
    const { supabase } = await import('../../services/supabase')
    const mockData = [{ id: '1', client_id: 'c1', amount: 100 }]
    supabase.from.mockReturnValue(mockFrom(mockData))
    const result = await paymentsService.listByClient('c1')
    expect(result).toEqual(mockData)
  })
})

describe('remindersService.listByClient', () => {
  it('fetches reminders for a client', async () => {
    const { supabase } = await import('../../services/supabase')
    const mockData = [{ id: '1', client_id: 'c1', message: 'Test' }]
    supabase.from.mockReturnValue(mockFrom(mockData))
    const result = await remindersService.listByClient('c1')
    expect(result).toEqual(mockData)
  })
})
