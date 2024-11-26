import { describe, expect, test } from 'vitest'
import { MoneyFormat } from './MoneyFormat'

describe(MoneyFormat, () => {
  describe('parse cents', () => {
    test('negative', () => {
      const actual = MoneyFormat.parse(' ( $ 0.25 ) ')
      const expected = { type: 'cents', amount: -25 }
      expect(actual).toEqual(expected)
    })
    test('partial cents', () => {
      expect(() => MoneyFormat.parse(' $ 0.255 ')).toThrow(
        MoneyFormat.errors.PARTIAL_CENTS,
      )
    })
    test('less than a dollar', () => {
      const actual = MoneyFormat.parse(' $ 0.25 ')
      const expected = { type: 'cents', amount: 25 }
      expect(actual).toEqual(expected)
    })
    test('one dollar', () => {
      const expected = { type: 'cents', amount: 1_00 }
      const actual = MoneyFormat.parse(' $ 1.00 ')
      expect(actual).toEqual(expected)
    })
    test('one hundred dollars', () => {
      const expected = { type: 'cents', amount: 100_00 }
      const actual = MoneyFormat.parse(' $ 100.00 ')
      expect(actual).toEqual(expected)
    })
    test('one thousand dollars', () => {
      const expected = { type: 'cents', amount: 1_000_00 }
      const actual = MoneyFormat.parse(' $ 1,000.00 ')
      expect(actual).toEqual(expected)
    })
  })
  describe('format cents', () => {
    test('negative', () => {
      const actual = MoneyFormat.format({ type: 'cents', amount: -25 })
      const expected = ' ( $ 0.25 ) '
      expect(actual).toBe(expected)
    })
    test('partial cents', () => {
      expect(() =>
        MoneyFormat.format({ type: 'cents', amount: 0.255 }),
      ).toThrow(MoneyFormat.errors.PARTIAL_CENTS)
    })
    test('less than a dollar', () => {
      const actual = MoneyFormat.format({ type: 'cents', amount: 25 })
      const expected = ' $ 0.25 '
      expect(actual).toBe(expected)
    })
    test('one dollar', () => {
      const actual = MoneyFormat.format({ type: 'cents', amount: 1_00 })
      const expected = ' $ 1.00 '
      expect(actual).toBe(expected)
    })
    test('one hundred dollars', () => {
      const actual = MoneyFormat.format({ type: 'cents', amount: 100_00 })
      const expected = ' $ 100.00 '
      expect(actual).toBe(expected)
    })
    test('one thousand dollars', () => {
      const actual = MoneyFormat.format({ type: 'cents', amount: 1_000_00 })
      const expected = ' $ 1,000.00 '
      expect(actual).toBe(expected)
    })
  })
})
