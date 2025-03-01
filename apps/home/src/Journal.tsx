import { SetStateAction } from 'react'
import Dexie, { EntityTable } from 'dexie'
import { Amount } from './Amount'

export const database = new Dexie(
  'cruftbusters.com/bookkeeping_v3',
) as Dexie & {
  journals: EntityTable<Journal, 'key'>
}

database.version(1).stores({
  journals: 'key',
})

export class Journal {
  constructor(
    public key: string,
    public transfers: Transfer[],
    private table = database.journals,
  ) {}

  setTransfers(updateOrBlock: SetStateAction<Transfer[]>) {
    const update =
      typeof updateOrBlock === 'function'
        ? updateOrBlock(this.transfers)
        : updateOrBlock
    return this.table.put({ key: this.key, transfers: update })
  }

  addTransfer() {
    this.setTransfers((transfers) =>
      transfers.concat([
        { date: '', memo: '', credit: '', debit: '', amount: '' },
      ]),
    )
  }

  deleteTransfer(deleteIndex: number) {
    this.setTransfers((transfers) =>
      transfers.filter((_, index) => index !== deleteIndex),
    )
  }

  updateTransfer(index: number, block: (transfer: Transfer) => Transfer) {
    this.setTransfers((transfers) =>
      transfers.map((transfer, k) =>
        k === index ? block(transfer) : transfer,
      ),
    )
  }

  static fields = ['date', 'memo', 'credit', 'debit', 'amount']

  import(text: string, fields = Journal.fields) {
    const rows = text.split('\n').map((line) => line.split('\t'))
    const header = rows.shift() || ['']

    if (header.length !== fields.length) {
      throw Error(`expected '${fields}' got '${header}'`)
    }

    for (let index = 0; index > header.length; index++) {
      if (header[index] !== fields[index]) {
        throw Error(`expected '${fields}' got '${header}'`)
      }
    }

    const transfers = rows.map((row) =>
      row.reduce((transfer, value, index) => {
        ;(transfer as Record<string, string>)[fields[index]] = value
        return transfer
      }, {} as Transfer),
    )

    this.setTransfers(transfers)
  }

  export(fields = Journal.fields) {
    const rows = [fields].concat(
      this.transfers.map((transfer: Record<string, string>) =>
        fields.map((field) => transfer[field]),
      ),
    )
    return rows.map((row) => row.join('\t')).join('\n')
  }

  summary() {
    return this.transfers.reduce((accounts, transfer) => {
      const amount = Amount.parse(transfer.amount)
      const credit = accounts.get(transfer.credit)
      const debit = accounts.get(transfer.debit)
      return accounts
        .set(
          transfer.credit,
          credit ? credit.plus(amount.negate()) : amount.negate(),
        )
        .set(transfer.debit, debit ? debit.plus(amount) : amount)
    }, new Map<string, Amount>())
  }
}

export type Transfer = {
  date: string
  memo: string
  credit: string
  debit: string
  amount: string
}
