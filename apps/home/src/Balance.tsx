import { formatAmount } from './formatAmount'
import { Amount2 } from './types'

export class Balance {
  readonly accounts = new Map<string, Amount2>()

  accrue(account: string, amount: Amount2) {
    let balance = this.accounts.get(account)
    if (balance === undefined) {
      balance = amount
      this.accounts.set(account, balance)
    } else {
      this.accounts.set(account, add(balance, amount))
    }
  }
}

function add(left: Amount2, right: Amount2) {
  if (left.prefix !== right.prefix || left.suffix !== right.suffix) {
    throw Error(
      `expected operands with matching prefix and suffix got '${formatAmount(left)}' and '${formatAmount(right)}'`,
    )
  }
  const precision = Math.max(left.precision, right.precision)
  const result =
    left.sign * parseInt(left.digits + '0'.repeat(precision - left.precision)) +
    right.sign *
      parseInt(right.digits + '0'.repeat(precision - right.precision))
  return {
    ...left,
    sign: Math.sign(result),
    digits: Math.abs(result).toString(),
    precision,
  }
}
