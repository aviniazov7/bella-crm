import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, fakeClients } from './testUtils'

vi.mock('../../services/firebase', () => ({ auth: {}, db: {}, storage: {} }))

const paySvc = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))
const clientSvc = vi.hoisted(() => ({ list: vi.fn() }))

vi.mock('../../services/payments', async () => {
  const actual = await vi.importActual('../../services/payments')
  return { paymentsService: paySvc, totalRevenue: actual.totalRevenue, default: paySvc }
})
vi.mock('../../services/clients', () => ({ clientsService: clientSvc, default: clientSvc }))

import { PaymentsPage } from '../../pages/PaymentsPage'

beforeEach(() => {
  vi.clearAllMocks()
  paySvc.list.mockResolvedValue([
    {
      id: 'p1',
      clientName: 'בלה כהן',
      amount: 150,
      date: '2026-06-10',
      method: 'cash',
      status: 'paid',
    },
  ])
  paySvc.create.mockResolvedValue({ id: 'p2' })
  clientSvc.list.mockResolvedValue(fakeClients)
})

describe('Payments page', () => {
  it('lists existing payments and the revenue summary', async () => {
    renderWithProviders(<PaymentsPage />)
    expect(await screen.findByText('בלה כהן')).toBeInTheDocument()
    // Summary stat card shows the total revenue
    expect(screen.getAllByText(/150/).length).toBeGreaterThan(0)
  })

  it('adds a payment', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PaymentsPage />)
    await screen.findByText('בלה כהן')

    await user.click(screen.getByRole('button', { name: '+ תשלום חדש' }))
    const dialog = await screen.findByRole('dialog')

    await user.selectOptions(within(dialog).getByLabelText('לקוח'), 'c1')
    await user.type(within(dialog).getByLabelText('סכום (₪)'), '200')
    await user.type(within(dialog).getByLabelText('תאריך'), '2026-06-24')
    await user.click(within(dialog).getByRole('button', { name: 'שמירה' }))

    await waitFor(() =>
      expect(paySvc.create).toHaveBeenCalledWith(
        expect.objectContaining({ clientId: 'c1', amount: 200, clientName: 'בלה כהן' })
      )
    )
  })
})
