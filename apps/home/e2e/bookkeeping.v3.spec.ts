import { test, expect } from '@playwright/test'

test('summarize two transfers', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping')

  await page.getByRole('button', { name: 'add transfer' }).click()
  const row0 = page.getByLabel('0')
  await row0.getByLabel('date').fill('2025-01-01')
  await row0.getByLabel('memo').fill('first transfer of the year!!!')
  await row0.getByLabel('credit').fill('equity:capital contribution')
  await row0.getByLabel('debit').fill('expense:insurance')
  await row0.getByLabel('amount').fill(' $ 300.00 ')

  await page.getByRole('button', { name: 'add transfer' }).click()
  const row1 = page.getByLabel('1')
  await row1.getByLabel('date').fill('2025-01-02')
  await row1.getByLabel('memo').fill('')
  await row1.getByLabel('credit').fill('income:via client')
  await row1.getByLabel('debit').fill('liability:client receivable')
  await row1.getByLabel('amount').fill(' $ 1,000.00 ')

  await page.getByRole('button', { name: 'add transfer' }).click()
  const row2 = page.getByLabel('2')
  await row2.getByLabel('date').fill('2025-01-03')
  await row2.getByLabel('memo').fill('')
  await row2.getByLabel('credit').fill('liability:client receivable')
  await row2.getByLabel('debit').fill('asset:checking account')
  await row2.getByLabel('amount').fill(' $ 1,000.00 ')

  expect(page.getByText('equity:capital contribution')).toContainText(
    ' ( $ 300.00 ) ',
  )
  expect(page.getByText('expense:insurance')).toContainText(' $ 300.00 ')
  expect(page.getByText('income:via client')).toContainText(
    ' ( $ 1,000.00 ) ',
  )
  expect(page.getByText('liability:client receivable')).toContainText(
    ' $ 0.00 ',
  )
  expect(page.getByText('asset:checking account')).toContainText(
    ' $ 1,000.00 ',
  )
})
