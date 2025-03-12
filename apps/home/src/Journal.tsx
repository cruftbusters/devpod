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

  summary(toPeriod: (date: string) => string) {
    const periods = []
    const snapshots: Map<string, Amount>[] = []

    const balance = new Balance()
    let lastPeriod = ''

    for (const transfer of this.transfers) {
      if (transfer.date !== '') {
        const period = toPeriod(transfer.date)

        if (lastPeriod !== '' && lastPeriod !== period) {
          periods.push(lastPeriod)
          snapshots.push(new Map(balance.map))
        }

        lastPeriod = period
      }

      const amount = Amount.parse(transfer.amount)

      balance.accrue(transfer.credit, amount.negate())
      balance.accrue(transfer.debit, amount)
    }

    periods.push(lastPeriod)
    snapshots.push(balance.map)

    const accounts: Set<string> = new Set()

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

class Balance {
  constructor(public map: Map<string, Amount> = new Map()) {}

  accrue(account: string, amount: Amount) {
    const items = []
    for (const item of account.split(':')) {
      items.push(item)
      const account = items.join(':')
      const entry = this.map.get(account)
      const update = entry ? entry.plus(amount) : amount
      if (update.mantissa === 0) {
        this.map.delete(account)
      } else {
        this.map.set(account, update)
      }
    }
  }
}
