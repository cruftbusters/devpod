import { SetStateAction } from 'react'
import Dexie, { EntityTable } from 'dexie'
import { Transfer } from './Transfer'

export const database = new Dexie(
  'cruftbusters.com/bookkeeping_v3',
) as Dexie & {
  journals: EntityTable<LiveJournal, 'key'>
}

database.version(1).stores({
  journals: 'key',
})

export class LiveJournal {
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
}
