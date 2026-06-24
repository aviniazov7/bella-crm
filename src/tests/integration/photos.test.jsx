import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, fakeClients } from './testUtils'

vi.mock('../../services/firebase', () => ({ auth: {}, db: {}, storage: {} }))

const photoSvc = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))
const uploadPhoto = vi.hoisted(() => vi.fn())
const clientSvc = vi.hoisted(() => ({ list: vi.fn() }))

vi.mock('../../services/photos', () => ({
  photosService: photoSvc,
  uploadPhoto,
  default: photoSvc,
}))
vi.mock('../../services/clients', () => ({ clientsService: clientSvc, default: clientSvc }))

import { PhotosPage } from '../../pages/PhotosPage'

beforeEach(() => {
  vi.clearAllMocks()
  photoSvc.list.mockResolvedValue([])
  photoSvc.create.mockResolvedValue({ id: 'ph1' })
  uploadPhoto.mockResolvedValue({ url: 'https://cdn/x.jpg', path: 'photos/c1/before-x.jpg' })
  clientSvc.list.mockResolvedValue(fakeClients)
  // jsdom lacks createObjectURL; the dropzone preview needs it.
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:preview')
})

describe('Photos upload', () => {
  it('shows an empty gallery initially', async () => {
    renderWithProviders(<PhotosPage />)
    expect(await screen.findByText('עדיין אין תמונות בגלריה')).toBeInTheDocument()
  })

  it('uploads before/after images and saves the record', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PhotosPage />)
    await screen.findByText('עדיין אין תמונות בגלריה')

    await user.click(screen.getByRole('button', { name: '+ העלאת תמונות' }))
    const dialog = await screen.findByRole('dialog')

    await user.selectOptions(within(dialog).getByLabelText('לקוח'), 'c1')

    const before = new File(['x'], 'before.png', { type: 'image/png' })
    const after = new File(['y'], 'after.png', { type: 'image/png' })
    await user.upload(within(dialog).getByLabelText('תמונת לפני'), before)
    await user.upload(within(dialog).getByLabelText('תמונת אחרי'), after)

    await user.type(within(dialog).getByLabelText('תאריך'), '2026-06-24')
    await user.click(within(dialog).getByRole('button', { name: 'שמירה' }))

    await waitFor(() => expect(uploadPhoto).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(photoSvc.create).toHaveBeenCalledWith(
        expect.objectContaining({ clientId: 'c1', beforeUrl: 'https://cdn/x.jpg' })
      )
    )
  })
})
