import { Money } from './types'

export class MoneyFormat {
  static errors = {
    PARTIAL_CENTS: 'partial cents is not implemented',
  }
  static parse(amountAsString: string): Money {
    amountAsString = amountAsString.trim()
    const sign = amountAsString[0] === '(' ? -1 : 1
    amountAsString = amountAsString.replace(/[^\d.]/g, '')
    const [dollarsAsString, centsAsString] = amountAsString.split('.')
    const dollars = parseInt(dollarsAsString)
    const cents = parseInt(centsAsString)
    if (cents > 99) {
      throw Error(MoneyFormat.errors.PARTIAL_CENTS)
    }
    return { type: 'cents', amount: sign * (cents + dollars * 100) }
  }
  static format(money: Money) {
    if (money.amount % 1 > 0) {
      throw Error(MoneyFormat.errors.PARTIAL_CENTS)
    }
    const sign = Math.sign(money.amount)
    const amount = Math.abs(money.amount)
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
