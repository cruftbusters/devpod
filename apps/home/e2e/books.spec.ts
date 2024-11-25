import { test, expect } from '@playwright/test'
import { TextSheet } from '../src/TextSheet'

test('has heading text', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping/v2')

  await expect(
    page.getByRole('heading', { name: 'Bookkeeping With Tests' }),
  ).toBeVisible()
})

test('add two movements', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping/v2')
  await page
    .getByLabel('text sheet')
    .fill(
      TextSheet.fromArray(
        ['date', 'memo', 'debitAccount', 'creditAccount', 'amount'],
        ['2024-01-01', 'memo 1', 'expense', 'liability', ' $ 4,000.00 '],
        ['2024-01-02', 'memo 2', 'liability', 'asset', ' $ 1,000.00 '],
      ).toText(),
    )

  await expect(page.getByText('total: $ 0.00 ')).toBeVisible()
  await expect(page.getByText('expense: $ 4,000.00')).toBeVisible()
  await expect(page.getByText('liability: ( $ 3,000.00 )')).toBeVisible()
  await expect(page.getByText('asset: ( $ 1,000.00 )')).toBeVisible()
})
