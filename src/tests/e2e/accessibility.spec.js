import { test } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

/**
 * Accessibility smoke test on the login page (the only page reachable without
 * auth). Fails on serious/critical violations.
 */
test.describe('Accessibility', () => {
  test('login page has no critical a11y violations', async ({ page }) => {
    await page.goto('/login')
    await injectAxe(page)
    await checkA11y(page, undefined, {
      axeOptions: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
      detailedReport: false,
    })
  })
})
