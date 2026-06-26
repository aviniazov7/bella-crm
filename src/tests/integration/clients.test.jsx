import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, fakeClients } from './testUtils'

vi.mock('../../services/firebase', () => ({ auth: {}, db: {}, storage: {} }))

const store = vi.hoisted(() => ({ data: [] }))
const svc = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))

vi.mock('../../services/clients', async () => {
  const actual = await vi.importActual('../../services/clients')
  return { clientsService: svc, filterClients: actual.filterClients, default: svc }
})

import { ClientsPage } from '../../pages/ClientsPage'

beforeEach(() => {
  vi.clearAllMocks()
  store.data = [...fakeClients]
  svc.list.mockImplementation(() => Promise.resolve(store.data))
  svc.create.mockImplementation((d) => {
    const created = { id: 'new', ...d }
    store.data = [...store.data, created]
    return Promise.resolve(created)
  })
  svc.update.mockImplementation(({ id, data }) => Promise.resolve({ id, ...data }))
  svc.remove.mockImplementation((id) => {
    store.data = store.data.filter((c) => c.id !== id)
    return Promise.resolve(id)
  })
})

describe('Clients CRUD', () => {
  it('renders the client list', async () => {
    renderWithProviders(<ClientsPage />)
    expect(await screen.findByText('בלה כהן')).toBeInTheDocument()
    expect(screen.getByText('דנה לוי')).toBeInTheDocument()
  })

  it('filters by search term', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPage />)
    await screen.findByText('בלה כהן')
    await user.type(screen.getByLabelText('חיפוש לקוחות'), 'דנה')
    await waitFor(() => expect(screen.queryByText('בלה כהן')).not.toBeInTheDocument())
    expect(screen.getByText('דנה לוי')).toBeInTheDocument()
  })

  it('adds a new client', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPage />)
    await screen.findByText('בלה כהן')

    await user.click(screen.getByRole('button', { name: 'לקוח חדש' }))
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText('שם מלא'), 'מאיה רז')
    await user.type(within(dialog).getByLabelText('טלפון'), '0541234567')
    await user.click(within(dialog).getByRole('button', { name: 'שמירה' }))

    await waitFor(() =>
      expect(svc.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'מאיה רז', phone: '0541234567' })
      )
    )
  })

  it('deletes a client after confirmation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPage />)
    await screen.findByText('בלה כהן')

    const deleteButtons = screen.getAllByRole('button', { name: 'מחיקה' })
    await user.click(deleteButtons[0])

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'מחיקה' }))

    await waitFor(() => expect(svc.remove).toHaveBeenCalled())
  })
})
