import { test, expect } from '@playwright/test'

/**
 * Routing / auth-guard E2E.
 * With no authenticated session, every protected route must redirect to /login.
 * These run on both desktop and mobile viewports.
 */
const PROTECTED_ROUTES = ['/', '/clients', '/calendar', '/payments', '/photos', '/reminders']

test.describe('Auth guard & navigation', () => {
  for (const route of PROTECTED_ROUTES) {
    test(`redirects ${route} to /login when unauthenticated`, async ({ page }) => {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login$/)
      await expect(page.getByRole('button', { name: 'התחברות' })).toBeVisible()
    })
  }

  test('login screen is responsive (no horizontal overflow)', async ({ page }) => {
    await page.goto('/login')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    // Allow a 1px rounding tolerance.
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
