import { formatAmount } from './formatAmount'
import { HeaderedSheet } from './HeaderedSheet'
import { parseAmount } from './parseAmount'
import { Transfer } from './types'

export class TextSheet {
  iterator: IterableIterator<string[]>
  constructor(iterator: IterableIterator<string[]>) {
    this.iterator = iterator
  }

  static fromArray(...array: string[][]) {
    return new TextSheet(array.values())
  }

  static fromText(text: string) {
    function* it() {
      let mode
      for (const line of text.split('\n')) {
        const values = ['']

        let isQuoted = false
        for (const char of line) {
          if (values[values.length - 1].length === 0 && char === '"') {
            isQuoted = true
          } else if (isQuoted && char === '"') {
            isQuoted = false
          } else if (
            !isQuoted &&
            mode === undefined &&
            (char === ',' || char === '\t')
          ) {
            mode = char
            values.push('')
          } else if (!isQuoted && char === mode) {
            values.push('')
          } else {
            values[values.length - 1] += char
          }
        }

        if (values.length > 1 || values[0].length > 0) {
          yield values
        }
      }
    }
    return new TextSheet(it())
  }

  toArray() {
    return Array.from(this.iterator)
  }

  toText() {
    return Array.from(this.iterator)
      .map((row) =>
        row
          .map((value) => (value.indexOf(',') > -1 ? `"${value}"` : value))
          .join(','),
      )
      .join('\n')
  }

  static fromTransfers(transfers: Transfer[]) {
    function* it() {
      yield ['debitAccount', 'creditAccount', 'amount']
      for (const { debitAccount, creditAccount, amount } of transfers) {
        yield [debitAccount, creditAccount, formatAmount(amount)]
      }
    }
    return new TextSheet(it())
  }

  *toTransfers() {
    const records = HeaderedSheet.fromTextSheet(
      ['debitAccount', 'creditAccount', 'amount'],
      this,
    )

    for (const [debitAccount, creditAccount, amountText] of records) {
      const amount = parseAmount(amountText)
      yield { debitAccount, creditAccount, amount }
    }
  }

  [Symbol.iterator]() {
    return this.iterator
  }
}
