import { Amount2 } from './types'

export function parseAmount(text: string): Amount2 {
  let prefix = ''
  let sign = 1
  let leftDigits = ''
  let rightDigits = ''
  let suffix = ''

  const chars = Array.from(text)

  let char = chars.shift()

  if (char === '-') {
    char = chars.shift()
    sign = -1
  }

  for (; char !== undefined && char.match(/[^0-9-]/); char = chars.shift()) {
    if (!char.match(/\s/)) {
      prefix += char
    }
  }

  for (; char !== undefined && char.match(/[^\s.]/); char = chars.shift()) {
    if (char.match(/[0-9]/)) {
      leftDigits += char
    } else if (char.match(/[^,]/)) {
      throw Error(`unexpected char '${char}' in '${text}'`)
    }
  }

  if (char === '.') {
    char = chars.shift()
    for (; char !== undefined && char.match(/[^\s]/); char = chars.shift()) {
      if (char.match(/[0-9]/)) {
        rightDigits += char
      } else {
        throw Error(`unexpected char '${char}' in '${text}'`)
      }
    }
  }

  for (; char !== undefined; char = chars.shift()) {
    if (!char.match(/\s/)) {
      suffix += char
    }
  }

  const digits = leftDigits + rightDigits
  const precision = rightDigits.length

  return {
    prefix,
    sign,
    digits,
    precision,
    suffix,
  }
}
