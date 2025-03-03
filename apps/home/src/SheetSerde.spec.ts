import { expect, test } from 'vitest'
import { SheetSerde } from './SheetSerde'

test('commas', () => {
  const sheet = SheetSerde.deserialize('date,memo,credit,debit,amount')
  expect(sheet).toEqual([['date', 'memo', 'credit', 'debit', 'amount']])
})
test('tabs', () => {
  const sheet = SheetSerde.deserialize('date\tmemo\tcredit\tdebit\tamount')
  expect(sheet).toEqual([['date', 'memo', 'credit', 'debit', 'amount']])
})
test('value contains comma', () => {
  const sheet = SheetSerde.deserialize(
    'date,memo,credit,debit,amount\n,,,,"$4,000.00"',
  )
  expect(sheet).toMatchObject([
    ['date', 'memo', 'credit', 'debit', 'amount'],
    ['', '', '', '', '$4,000.00'],
  ])
})
test('comma in unquoted value', () => {
  const sheet = SheetSerde.deserialize('date\tmem,o')
  expect(sheet).toMatchObject([['date', 'mem,o']])
})
test('tab in unquoted value', () => {
  const sheet = SheetSerde.deserialize('date,mem\to')
  expect(sheet).toMatchObject([['date', 'mem\to']])
})
test('quote in value', () => {
  const sheet = SheetSerde.deserialize('a"')
  expect(sheet).toMatchObject([['a"']])
})
