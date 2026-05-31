import { test, expect } from '@playwright/test'

// Placeholder E2E smoke test — replace with real checkout-flow coverage.
test('app loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Vite|React|Checkout/i)
})
