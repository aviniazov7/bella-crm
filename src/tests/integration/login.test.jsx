import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './testUtils'

vi.mock('../../services/firebase', () => ({ auth: {}, db: {}, storage: {} }))

const authMocks = vi.hoisted(() => ({ signIn: vi.fn() }))
vi.mock('../../services/auth', () => ({
  signIn: authMocks.signIn,
  authErrorMessage: () => 'פרטי התחברות שגויים',
}))

import { LoginPage } from '../../pages/LoginPage'

beforeEach(() => vi.clearAllMocks())

describe('Login flow', () => {
  it('signs in with the entered credentials', async () => {
    authMocks.signIn.mockResolvedValue({ uid: 'u1' })
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    await user.type(screen.getByLabelText('אימייל'), 'owner@bella.com')
    await user.type(screen.getByLabelText('סיסמה'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'כניסה' }))

    await waitFor(() =>
      expect(authMocks.signIn).toHaveBeenCalledWith('owner@bella.com', 'secret123')
    )
  })

  it('shows an error message on failed sign-in', async () => {
    authMocks.signIn.mockRejectedValue({ code: 'auth/invalid-credential' })
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    await user.type(screen.getByLabelText('אימייל'), 'owner@bella.com')
    await user.type(screen.getByLabelText('סיסמה'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'כניסה' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('פרטי התחברות שגויים')
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)
    await user.click(screen.getByRole('button', { name: 'כניסה' }))
    expect(await screen.findAllByText('שדה חובה')).not.toHaveLength(0)
    expect(authMocks.signIn).not.toHaveBeenCalled()
  })
})
