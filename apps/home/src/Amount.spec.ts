import { describe, expect, test } from 'vitest'
import { Amount } from './Amount'

describe(Amount, () => {
  describe('parse', () => {
    test('zero', () => {
      expect(Amount.parse('0')).toEqual(new Amount('', 0, 0))
      expect(Amount.parse('0.0')).toEqual(new Amount('', 0, 1))
      expect(Amount.parse('0.00')).toEqual(new Amount('', 0, 2))
      expect(Amount.parse('00.0')).toEqual(new Amount('', 0, 1))

      expect(Amount.parse(' $ 0 ')).toEqual(new Amount('$', 0, 0))
      expect(Amount.parse(' $ 0.0 ')).toEqual(new Amount('$', 0, 1))
      expect(Amount.parse(' $ - ')).toEqual(new Amount('$', 0, 2))
    })
    test('negative one', () => {
      expect(Amount.parse('-1')).toEqual(new Amount('', -1, 0))
      expect(Amount.parse('-1.0')).toEqual(new Amount('', -10, 1))
      expect(Amount.parse('-1.00')).toEqual(new Amount('', -100, 2))
      expect(Amount.parse('-01.0')).toEqual(new Amount('', -10, 1))

      expect(Amount.parse(' ( $ 1 ) ')).toEqual(new Amount('$', -1, 0))
      expect(Amount.parse(' ( $ 1.0 ) ')).toEqual(new Amount('$', -10, 1))
    })
  })
  describe('plus', () => {
    test('two integers', () => {
      expect(Amount.parse('1').plus(Amount.parse('2'))).toEqual(
        new Amount('', 3, 0),
      )
    })
    test('two decimals', () => {
      expect(Amount.parse('1.02').plus(Amount.parse('2.01'))).toEqual(
        new Amount('', 303, 2),
      )
    })
    test('two decimals with unequal precision', () => {
      const a0 = Amount.parse('1.024')
      const a1 = Amount.parse('2.01')
      expect(() => a0.plus(a1)).toThrow(
        Amount.PARSE_ERROR.PRECISION_MISMATCH(a0, a1),
      )
    })
    test('two integers with unequal sign', () => {
      expect(Amount.parse('-1').plus(Amount.parse('2'))).toEqual(
        new Amount('', 1, 0),
      )
    })
    test('two decimals with unequal sign', () => {
      expect(Amount.parse('1.23').plus(Amount.parse('-4.56'))).toEqual(
        new Amount('', -333, 2),
      )
    })
    test('two integers with unequal prefix', () => {
      const a0 = Amount.parse('$ 1.02')
      const a1 = Amount.parse('USD 2.01')
      expect(() => a0.plus(a1)).toThrow(
        Amount.PARSE_ERROR.PREFIX_MISMATCH(a0, a1),
      )
    })
  })
})
