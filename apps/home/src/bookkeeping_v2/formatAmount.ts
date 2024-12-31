import { Amount2 } from './types'

export function formatAmount({
  sign,
  prefix,
  digits,
  precision,
  suffix,
}: Amount2) {
  for (; prefix === '$' && precision < 2; ) {
    precision++
    digits += '0'
  }

  const unsigned = [
    prefix,
    precision > 0
      ? `${commas(digits.slice(0, -precision))}.${digits.slice(-precision)}`
      : commas(digits),
    suffix,
  ]
    .filter((text) => text.length > 0)
    .join(' ')

  return ` ${sign < 0 ? ` ( ${unsigned} )` : unsigned} `
}

function commas(digits: string) {
  const result = []
  for (let index = 0; index < digits.length; index++) {
    const k = digits.length - 1 - index
    result.unshift(digits[k])
    if (k !== 0 && index % 3 === 2) {
      result.unshift(',')
    }
  }
  return result.join('')
}
