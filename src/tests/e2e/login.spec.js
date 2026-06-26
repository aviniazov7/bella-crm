import { test, expect } from '@playwright/test'

/**
 * Login page E2E.
 * Runs under both the desktop (1280px) and mobile (375px) projects defined in
 * playwright.config.js, so the responsive layout is exercised on every spec.
 */
test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders the branded login form', async ({ page }) => {
    await expect(page).toHaveTitle(/Bella CRM/)
    await expect(page.getByRole('heading', { name: 'Bella CRM' })).toBeVisible()
    await expect(page.getByLabel('אימייל')).toBeVisible()
    await expect(page.getByLabel('סיסמה')).toBeVisible()
    await expect(page.getByRole('button', { name: 'כניסה' })).toBeVisible()
  })

  test('shows validation errors when submitting empty', async ({ page }) => {
    await page.getByRole('button', { name: 'כניסה' }).click()
    await expect(page.getByText('שדה חובה').first()).toBeVisible()
  })

  test('accepts typing into the fields', async ({ page }) => {
    await page.getByLabel('אימייל').fill('owner@bella.com')
    await page.getByLabel('סיסמה').fill('secret123')
    await expect(page.getByLabel('אימייל')).toHaveValue('owner@bella.com')
  })
})
