import { test, expect } from '@playwright/test'
import { TextSheet } from '../src/bookkeeping_v2/TextSheet'

test('has heading text', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping/v2')

  await expect(page.getByRole('heading', { name: 'Bookkeeping' })).toBeVisible()
})

test('summarize transfers', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping/v2')
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
        ['income', 'income statement', ' $ 77,500.00 '],
      ).toText(),
    )

  await expect(page.getByText('hours invoiced: 77.50 hours')).toBeVisible()
  await expect(page.getByText('hours worked: ( 77.50 hours )')).toBeVisible()
  await expect(
    page.getByText('accounts receivable: $ 37,500.00 '),
  ).toBeVisible()
  await expect(page.getByText('income: $ 0.00 ')).toBeVisible()
  await expect(page.getByText('checking account: $ 40,000.00 ')).toBeVisible()
  await expect(
    page.getByText('income statement: ( $ 77,500.00 ) '),
  ).toBeVisible()

  await expect(page.getByText(`error: `)).not.toBeVisible()
})
test('summarize sub accounts', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping/v2')
  await page
    .getByLabel('text sheet')
    .fill(
      TextSheet.fromArray(
        ['debitAccount', 'creditAccount', 'amount'],
        ['hours invoiced:client a', 'hours worked:client a', ' 20 hours '],
        ['hours invoiced:client b', 'hours worked:client b', ' 20 hours '],
      ).toText(),
    )

  const hoursInvoiced = page.getByText('hours invoiced: 40 hours')
  await expect(hoursInvoiced).toBeVisible()
  await expect(hoursInvoiced.getByText('client a: 20 hours')).toBeVisible()
  await expect(hoursInvoiced.getByText('client b: 20 hours')).toBeVisible()
  const hoursWorked = page.getByText('hours worked: ( 40 hours )')
  await expect(hoursWorked).toBeVisible()
  await expect(hoursWorked.getByText('client a: ( 20 hours )')).toBeVisible()
  await expect(hoursWorked.getByText('client b: ( 20 hours )')).toBeVisible()

  await expect(page.getByText(`error: `)).not.toBeVisible()
})
test('adding mixed units is not supported', async ({ page }) => {
  await page.goto('http://localhost:5173/bookkeeping/v2')
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
      `expected operands with matching prefix and suffix got ' 40 hours ' and ' $ 40,000.00 '`,
    ),
  ).toBeVisible()
})
