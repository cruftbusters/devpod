import { test, expect } from '@playwright/test'
import { TextSheet } from '../src/TextSheet'

test('has heading text', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping/v2')

  await expect(
    page.getByRole('heading', { name: 'Bookkeeping With Tests' }),
  ).toBeVisible()
})

test.describe('v2', () => {
  test('summarize transfers', async ({ page }) => {
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
})

test.describe('v3', () => {
  test('summarize transfers', async ({ page }) => {
    await page.goto('http://localhost:5173/bookkeeping/v3')
    await page
      .getByLabel('text sheet')
      .fill(
        TextSheet.fromArray(
          ['debitAccount', 'creditAccount', 'amount'],
          ['hours invoiced', 'hours worked', ' 40 hours '],
          ['accounts receivable', 'income', ' $ 40,000.00 '],
          ['hours invoiced', 'hours worked', ' 37.50 hours '],
          ['accounts receivable', 'income', ' $ 37,500.00 '],
          ['checking account', 'accounts receivable', ' $ 40,000.00 '],
        ).toText(),
      )

    await expect(page.getByText('total: empty')).toBeVisible()
    await expect(page.getByText('hours invoiced: 77.50 hours')).toBeVisible()
    await expect(page.getByText('hours worked: ( 77.50 hours )')).toBeVisible()
    await expect(
      page.getByText('accounts receivable: $ 37,500.00 '),
    ).toBeVisible()
    await expect(page.getByText('income: ( $ 77,500.00 ) ')).toBeVisible()
    await expect(page.getByText('checking account: $ 40,000.00 ')).toBeVisible()

    await expect(page.getByText(`error: `)).not.toBeVisible()
  })
  test('adding mixed units is not supported', async ({ page }) => {
    await page.goto('http://localhost:5173/bookkeeping/v3')
    await page
      .getByLabel('text sheet')
      .fill(
        TextSheet.fromArray(
          ['debitAccount', 'creditAccount', 'amount'],
          ['hours invoiced', 'hours worked', ' 40 hours '],
          ['hours invoiced', 'hours worked', ' $ 40,000 '],
        ).toText(),
      )

    await expect(
      page.getByText(
        `expected operands with matching prefix and suffix got ' 40 hours ' and ' $ 40,000 '`,
      ),
    ).toBeVisible()
  })
})
