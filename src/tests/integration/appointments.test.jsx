import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, fakeClients } from './testUtils'

vi.mock('../../services/firebase', () => ({ auth: {}, db: {}, storage: {} }))

const apptSvc = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))
const clientSvc = vi.hoisted(() => ({ list: vi.fn() }))

vi.mock('../../services/appointments', async () => {
  const actual = await vi.importActual('../../services/appointments')
  return {
    appointmentsService: apptSvc,
    toCalendarEvents: actual.toCalendarEvents,
    default: apptSvc,
  }
})
vi.mock('../../services/clients', () => ({ clientsService: clientSvc, default: clientSvc }))

import { CalendarPage } from '../../pages/CalendarPage'

beforeEach(() => {
  vi.clearAllMocks()
  apptSvc.list.mockResolvedValue([])
  apptSvc.create.mockResolvedValue({ id: 'a1' })
  clientSvc.list.mockResolvedValue(fakeClients)
})

describe('Calendar / appointments', () => {
  it('renders the calendar with a new-appointment button', async () => {
    renderWithProviders(<CalendarPage />)
    expect(await screen.findByRole('button', { name: 'תור חדש' })).toBeInTheDocument()
  })

  it('creates an appointment through the form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CalendarPage />)
    await user.click(await screen.findByRole('button', { name: 'תור חדש' }))

    const dialog = await screen.findByRole('dialog')
    await user.selectOptions(within(dialog).getByLabelText('לקוח'), 'c1')
    await user.selectOptions(within(dialog).getByLabelText('סוג טיפול'), 'מניקור')
    await user.type(within(dialog).getByLabelText('תאריך'), '2026-06-25')
    await user.type(within(dialog).getByLabelText('שעה'), '11:30')
    await user.click(within(dialog).getByRole('button', { name: 'שמירה' }))

    await waitFor(() =>
      expect(apptSvc.create).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: 'c1',
          serviceType: 'מניקור',
          clientName: 'בלה כהן',
        })
      )
    )
  })
})
