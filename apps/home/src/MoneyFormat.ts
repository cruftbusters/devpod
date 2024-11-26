import { Money } from './types'

export class MoneyFormat {
  static format(money: Money) {
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
