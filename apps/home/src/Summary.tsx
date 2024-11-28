import { AmountFormat } from './AmountFormat'
import { TextSheet } from './TextSheet'
import { Balance } from './types'

export class Summary {
  static errors = {
    MISSING_HEADERS: 'missing headers',
    PARTIAL_CENTS: 'partial cents',
  }
  static fromTextSheet(sheet: TextSheet): Balance {
    const result = sheet.iterator.next()
    if (result.done === true) {
      throw Error(Summary.errors.MISSING_HEADERS)
    }

    const headers = result.value
    const indices: number[] = []

    for (const name of ['debitAccount', 'creditAccount', 'amount']) {
      const index = headers.indexOf(name)
      if (index < 0) {
        throw Error(`could not find header with name '${name}'`)
      }
      indices.push(index)
    }

    function map(row: string[]) {
      const values: string[] = []
      indices.forEach((index) => {
        values.push(row[index])
      })
      return values
    }

    const balance: Balance = { value: 0, unit: 'cents' }

    for (const record of sheet.iterator) {
      const [debitAccount, creditAccount, amountText] = map(record)
      const amount = AmountFormat.parse(amountText)
      accrue(balance, debitAccount, amount.value)
      accrue(balance, creditAccount, -amount.value)
    }

    return balance
  }
}

function accrue(balance: Balance, name: string, amount: number) {
  balance.value += amount
  if (balance.children === undefined) {
    balance.children = new Map()
  }
  let child = balance.children.get(name)
  if (child === undefined) {
    child = { value: 0, unit: 'cents' }
    balance.children.set(name, child)
  }
  child.value += amount
}
