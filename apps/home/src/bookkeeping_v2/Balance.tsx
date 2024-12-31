import { formatAmount } from './formatAmount'
import { Amount2, Transfer } from './types'

export type AccountBalances = Map<
  string,
  { amount: Amount2; accounts?: AccountBalances }
>

export function summarize(transfers: Transfer[]) {
  const result = new Map()

  for (const { debitAccount, creditAccount, amount } of transfers) {
    accrueBalance(result, debitAccount.split(':'), amount)
    accrueBalance(result, creditAccount.split(':'), {
      ...amount,
      sign: -amount.sign,
    })
  }

  return result
}

function accrueBalance(
  accounts: AccountBalances,
  path: string[],
  amount: Amount2,
) {
  const account = path.shift()
  if (account === undefined) {
    return
  }
  let balance = accounts.get(account)
  if (balance === undefined) {
    balance = { amount }
    accounts.set(account, balance)
  } else {
    balance.amount = add(balance.amount, amount)
  }

  if (balance.accounts === undefined) {
    balance.accounts = new Map()
  }

  accrueBalance(balance.accounts, path, amount)
}

function add(left: Amount2, right: Amount2) {
  if (left.prefix !== right.prefix || left.suffix !== right.suffix) {
    throw Error(
      `expected operands with matching prefix and suffix got '${formatAmount(left)}' and '${formatAmount(right)}'`,
    )
  }

  const precision = Math.max(left.precision, right.precision)
  const integer =
    left.sign *
      parseInt(left.digits) *
      Math.pow(10, precision - left.precision) +
    right.sign *
      parseInt(right.digits) *
      Math.pow(10, precision - right.precision)
  const result = Math.abs(integer).toString()

  return {
    ...left,
    sign: Math.sign(integer),
    digits: '0'.repeat(Math.max(0, 1 + precision - result.length)) + result,
    precision,
  }
}
