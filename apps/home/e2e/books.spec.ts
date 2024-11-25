import { test, expect } from '@playwright/test'

test('has heading text', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping/v2')

  await expect(page.getByRole('heading', { name: 'Bookkeeping With Tests' })).toBeVisible()
})
