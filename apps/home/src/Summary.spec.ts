import { describe, expect, test } from 'vitest'
import { Summary } from './Summary'
import { TextSheet } from './TextSheet'

describe(Summary, () => {
  test('missing headers', () => {
    const sheet = TextSheet.fromArray()
    expect(() => Summary.fromTextSheet(sheet)).toThrow(
      Summary.errors.MISSING_HEADERS,
    )
  })
  test('empty', () => {
    const sheet = TextSheet.fromArray([
      'debitAccount',
      'creditAccount',
      'amount',
    ])
    const actual = Summary.fromTextSheet(sheet)
    expect(actual).toEqual({ value: 0, unit: 'cents' })
  })
  test('one transfer', () => {
    const sheet = TextSheet.fromArray(
      ['date', 'memo', 'debitAccount', 'creditAccount', 'amount'],
      ['date', 'memo', 'debitAccount', 'creditAccount', ' $ 1000.50 '],
    )
    const actual = Summary.fromTextSheet(sheet)
    expect(actual).toEqual({
      value: 0,
      unit: 'cents',
      children: new Map([
        ['debitAccount', { value: 100050, unit: 'cents' }],
        ['creditAccount', { value: -100050, unit: 'cents' }],
      ]),
    })
  })
  test('throw error for partial cents', () => {
    const sheet = TextSheet.fromArray(
      ['date', 'memo', 'debitAccount', 'creditAccount', 'amount'],
      ['date', 'memo', 'debitAccount', 'creditAccount', ' $ 1000.505 '],
    )
    expect(() => Summary.fromTextSheet(sheet)).toThrow(
      Summary.errors.PARTIAL_CENTS,
    )
  })
})
