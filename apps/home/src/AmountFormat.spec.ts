import { describe, expect, test } from 'vitest'
import { AmountFormat } from './AmountFormat'
import { Amount } from './types'

describe(AmountFormat, () => {
  describe('parse', () => {
    test('negative', () => {
      const actual = AmountFormat.parse(' ( $ 0.25 ) ')
      const expected: Amount = { value: -25, unit: 'cents' }
      expect(actual).toEqual(expected)
    })
    test('partial cents', () => {
      expect(() => AmountFormat.parse(' $ 0.255 ')).toThrow(
        AmountFormat.errors.PARTIAL_CENTS,
      )
    })
    test('less than a dollar', () => {
      const actual = AmountFormat.parse(' $ 0.25 ')
      const expected: Amount = { value: 25, unit: 'cents' }
      expect(actual).toEqual(expected)
    })
    test('one dollar', () => {
      const actual = AmountFormat.parse(' $ 1.00 ')
      const expected: Amount = { value: 1_00, unit: 'cents' }
      expect(actual).toEqual(expected)
    })
    test('one hundred dollars', () => {
      const actual = AmountFormat.parse(' $ 100.00 ')
      const expected: Amount = { value: 100_00, unit: 'cents' }
      expect(actual).toEqual(expected)
    })
    test('one thousand dollars', () => {
      const actual = AmountFormat.parse(' $ 1,000.00 ')
      const expected: Amount = { value: 1_000_00, unit: 'cents' }
      expect(actual).toEqual(expected)
    })
  })
  describe('format', () => {
    test('negative', () => {
      const actual = AmountFormat.format({ value: -25, unit: 'cents' })
      const expected = ' ( $ 0.25 ) '
      expect(actual).toBe(expected)
    })
    test('partial cents', () => {
      expect(() =>
        AmountFormat.format({ value: 0.255, unit: 'cents' }),
      ).toThrow(AmountFormat.errors.PARTIAL_CENTS)
    })
    test('less than a dollar', () => {
      const actual = AmountFormat.format({ value: 25, unit: 'cents' })
      const expected = ' $ 0.25 '
      expect(actual).toBe(expected)
    })
    test('one dollar', () => {
      const actual = AmountFormat.format({ value: 1_00, unit: 'cents' })
      const expected = ' $ 1.00 '
      expect(actual).toBe(expected)
    })
    test('one hundred dollars', () => {
      const actual = AmountFormat.format({ value: 100_00, unit: 'cents' })
      const expected = ' $ 100.00 '
      expect(actual).toBe(expected)
    })
    test('one thousand dollars', () => {
      const actual = AmountFormat.format({ value: 1_000_00, unit: 'cents' })
      const expected = ' $ 1,000.00 '
      expect(actual).toBe(expected)
    })
  })
})
