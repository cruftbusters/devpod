import { describe, expect, test } from 'vitest'
import { parseAmount } from './parseAmount'

describe(parseAmount, () => {
  test('empty string', () => {
    expect(parseAmount('')).toEqual({
      digits: '',
      precision: 0,
      prefix: '',
      sign: 1,
      suffix: '',
    })
  })
  test('positive integer', () => {
    expect(parseAmount('1')).toEqual({
      digits: '1',
      precision: 0,
      prefix: '',
      sign: 1,
      suffix: '',
    })
  })
  test('negative integer', () => {
    expect(parseAmount('-1')).toEqual({
      digits: '1',
      precision: 0,
      prefix: '',
      sign: -1,
      suffix: '',
    })
  })
  test('negative prefixed integer', () => {
    expect(parseAmount('-$1')).toEqual({
      digits: '1',
      precision: 0,
      prefix: '$',
      sign: -1,
      suffix: '',
    })
  })
})
