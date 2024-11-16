export type Ledger = {
  key: string
  name: string
}

export type Selection = {
  key: string
  value: string
}

export type Transfer = {
  key: string
  ledger: string
  timestamp: string
  debitAccount: string
  creditAccount: string
  amount: Number
}

import Dexie, { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

export const database = new Dexie('cruftbusters.com') as Dexie & {
  ledgers: EntityTable<Ledger, 'key'>
  selections: EntityTable<Selection, 'key'>
  transfers: EntityTable<Transfer, 'key'>
}

database.version(1).stores({
  ledgers: 'key',
  selections: 'key',
  transfers: 'key, ledger, [timestamp+key]',
})

export function useLedgers() {
  return useLiveQuery(async () => {
    const ledgers = await database.ledgers.toArray()

    const key = await database.selections
      .get('ledgerKey')
      .then((kv) => kv?.value || '')

    const ledger = ledgers.find((item) => item.key === key)

    if (ledger === undefined) {
      return { ledgers }
    }

    const transfers = await database.transfers
      .where({ ledger: key })
      .sortBy('[timestamp+key]')

    return { ledgers, ledger: { ...ledger, transfers } }
  })
}

