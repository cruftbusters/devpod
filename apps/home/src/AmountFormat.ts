import { Amount } from './types'

export class AmountFormat {
  static errors = {
    PARTIAL_CENTS: 'partial cents is not implemented',
  }
  static parse(text: string): Amount {
    text = text.trim()
    const sign = text[0] === '(' ? -1 : 1
    text = text.replace(/[^\d.]/g, '')
    const [dollarsAsString, centsAsString] = text.split('.')
    const dollars = parseInt(dollarsAsString)
    const cents = parseInt(centsAsString)
    if (cents > 99) {
      throw Error(AmountFormat.errors.PARTIAL_CENTS)
    }
    return { value: sign * (cents + dollars * 100), unit: 'cents' }
  }
  static format(money: Amount) {
    if (money.value % 1 > 0) {
      throw Error(AmountFormat.errors.PARTIAL_CENTS)
    }
    const sign = Math.sign(money.value)
    const amount = Math.abs(money.value)
    const dollars = Math.floor(amount / 100).toString()
    const dollarsWithCommasChars = []
    for (let index = 0; index < dollars.length; index++) {
      dollarsWithCommasChars.unshift(dollars[dollars.length - 1 - index])
      if (index % 3 === 2 && index !== dollars.length - 1) {
        dollarsWithCommasChars.unshift(',')
      }
    }
    const dollarsWithCommas = dollarsWithCommasChars.join('')
    const cents = (amount % 100).toString().padStart(2, '0')
    const concat = ` $ ${dollarsWithCommas}.${cents} `
    return sign >= 0 ? concat : ` (${concat}) `
  }
}
