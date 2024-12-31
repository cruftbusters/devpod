import { describe, expect, test } from 'vitest'
import { formatAmount } from './formatAmount'

describe(formatAmount, () => {
  test('zero dollars is padded to precision 2', () => {
    const actual = formatAmount({
      sign: 1,
      prefix: '$',
      digits: '0',
      precision: 0,
      suffix: '',
    })
    const expected = ' $ 0.00 '
    expect(actual).toBe(expected)
  })
  test('zero for other units is not padded by default', () => {
    const actual = formatAmount({
      sign: 1,
      prefix: '',
      digits: '0',
      precision: 0,
      suffix: 'hours',
    })
    const expected = ' 0 hours '
    expect(actual).toBe(expected)
  })
})
