import { describe, expect, test } from 'vitest'
import { TransferArraySheet } from './Transfer'

describe('import', () => {
  test('missing fields', () => {
    expect(() => TransferArraySheet.toArray([['']])).toThrow(
      "expected header to contain 'date' got ''",
    )
    expect(() => TransferArraySheet.toArray([['date']])).toThrow(
      "expected header to contain 'memo' got 'date'",
    )
    expect(() => TransferArraySheet.toArray([['date', 'memo']])).toThrow(
      "expected header to contain 'credit' got 'date,memo'",
    )
    expect(() =>
      TransferArraySheet.toArray([['date', 'memo', 'credit']]),
    ).toThrow("expected header to contain 'debit' got 'date,memo,credit'")
  })
  test('got header no records', () => {
    const transfers = TransferArraySheet.toArray([
      ['date', 'memo', 'credit', 'debit', 'amount'],
    ])
    expect(transfers).toEqual([])
  })
  test('default values', () => {
    const transfers = TransferArraySheet.toArray([
      ['date', 'memo', 'credit', 'debit', 'amount'],
      [],
    ])
    expect(transfers).toEqual([
      { date: '', memo: '', credit: '', debit: '', amount: '' },
    ])
  })
})
