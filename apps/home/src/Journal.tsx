import { SetStateAction } from 'react'
import Dexie, { EntityTable } from 'dexie'
import { Amount } from './Amount'
import { Transfer } from './Transfer'

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

  periods(toPeriod: (date?: string) => string | undefined) {
    const accounts: Set<string> = new Set()
    const balance: Map<string, Amount> = new Map()

    function accrue(account: string, amount: Amount) {
      const items = []
      for (const item of account.split(':')) {
        items.push(item)
        const account = items.join(':')
        const entry = balance.get(account)
        const update = entry ? entry.plus(amount) : amount
        if (update.mantissa === 0) {
          balance.delete(account)
        } else {
          balance.set(account, update)
        }
      }
    }

    let lastPeriod = ''
    const periods = []
    const snapshots: Map<string, Amount>[] = []

    for (const transfer of this.transfers) {
      const period: string = toPeriod(transfer.date) || lastPeriod
      if (lastPeriod !== period) {
        periods.push(lastPeriod)
        snapshots.push(new Map(balance))
        lastPeriod = period
      }

      const amount = Amount.parse(transfer.amount)

      accrue(transfer.credit, amount.negate())
      accrue(transfer.debit, amount)
    }

    periods.push(lastPeriod)
    snapshots.push(balance)

    for (const snapshot of snapshots) {
      for (const account of snapshot.keys()) {
        accounts.add(account)
      }
    }

    return {
      accounts: Array.from(accounts)
        .sort()
        .map((name) => ({
          path: name.split(':'),
          snapshots: snapshots.map((balance) => balance.get(name)),
        })),
      periods,
    }
  }
}
