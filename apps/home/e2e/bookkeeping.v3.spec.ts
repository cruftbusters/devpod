import { test, expect } from '@playwright/test'

test('persist multiple journals', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping')
  const createJournalButton = page.getByRole('button', {
    name: 'create journal',
  })
  const addTransferButton = page.getByRole('button', { name: 'add transfer' })
  const row0 = page.getByLabel('0')

  await createJournalButton.click()
  await addTransferButton.click()
  await row0.getByLabel('date').fill('2025-01-01')

  await createJournalButton.click()
  await addTransferButton.click()
  await row0.getByLabel('date').fill('2025-01-02')

  await createJournalButton.click()
  await addTransferButton.click()
  await row0.getByLabel('date').fill('2025-01-03')

  await page.reload()

  await page.getByLabel('select journal').selectOption('new journal')
  await expect(row0.getByLabel('date')).toHaveValue('2025-01-01')

  await page.getByLabel('select journal').selectOption('new journal (2)')
  await expect(row0.getByLabel('date')).toHaveValue('2025-01-02')

  await page.getByLabel('select journal').selectOption('new journal (3)')
  await expect(row0.getByLabel('date')).toHaveValue('2025-01-03')
})

test('create update delete transfer and summary', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping')
  const createJournalButton = page.getByRole('button', {
    name: 'create journal',
  })
  const addTransferButton = page.getByRole('button', { name: 'add transfer' })

  await createJournalButton.click()
  await addTransferButton.click()
  const row0 = page.getByLabel('0')
  await row0.getByLabel('date').fill('2025-01-01')
  await row0.getByLabel('memo').fill('first transfer of the year!!!')
  await row0.getByLabel('credit').fill('equity:capital contribution')
  await row0.getByLabel('debit').fill('expense:insurance')
  await row0.getByLabel('amount').fill(' $ 300.00 ')

  await addTransferButton.click()
  const row1 = page.getByLabel('1')
  await row1.getByLabel('date').fill('2025-01-02')
  await row1.getByLabel('memo').fill('')
  await row1.getByLabel('credit').fill('income:via client')
  await row1.getByLabel('debit').fill('liability:client receivable')
  await row1.getByLabel('amount').fill(' $ 1,000.00 ')

  await addTransferButton.click()
  const row2 = page.getByLabel('2')
  await row2.getByLabel('date').fill('2025-01-03')
  await row2.getByLabel('memo').fill('')
  await row2.getByLabel('credit').fill('liability:client receivable')
  await row2.getByLabel('debit').fill('asset:checking account')
  await row2.getByLabel('amount').fill(' $ 1,000.00 ')

  await addTransferButton.click()
  const row3 = page.getByLabel('3')
  await row3.getByLabel('date').fill('2025-01-04')
  await row3.getByLabel('memo').fill('')
  await row3.getByLabel('credit').fill('liability:client receivable')
  await row3.getByLabel('debit').fill('asset:checking account')
  await row3.getByLabel('amount').fill(' $ 1,000.00 ')
  await row3.getByLabel('delete').click()

  const summary = page.getByLabel('summary')
  expect(summary.getByLabel('equity:capital contribution')).toContainText(
    ' ( $ 300.00 ) ',
  )
  expect(summary.getByLabel('expense:insurance')).toContainText(' $ 300.00 ')
  expect(summary.getByLabel('income:via client')).toContainText(
    ' ( $ 1,000.00 ) ',
  )
  expect(summary.getByLabel('liability:client receivable')).toContainText(
    ' $ 0.00 ',
  )
  expect(summary.getByLabel('asset:checking account')).toContainText(
    ' $ 1,000.00 ',
  )
})
