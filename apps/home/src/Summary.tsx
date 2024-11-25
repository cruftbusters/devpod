import { TextSheet } from './TextSheet'
import { Balance } from './types'

export class Summary {
  static errors = { MISSING_HEADERS: 'missing headers' }
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

    const balance: Balance = { type: 'cents', amount: 0 }

    for (const record of sheet.iterator) {
      const [debitAccount, creditAccount, amountAsString] = map(record)
      const amount = parseInt(amountAsString)
      accrue(balance, debitAccount, amount)
      accrue(balance, creditAccount, -amount)
    }

    return balance
  }
}

function accrue(balance: Balance, name: string, amount: number) {
  balance.amount += amount
  if (balance.children === undefined) {
    balance.children = new Map()
  }
  let child = balance.children.get(name)
  if (child === undefined) {
    child = { type: 'cents', amount: 0 }
    balance.children.set(name, child)
  }
  child.amount += amount
}
