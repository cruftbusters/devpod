export type Ledger = LedgerData & {
  movements: Movement[]
}

export type LedgerData = {
  key: string
  name: string
}

export type Selection = {
  key: string
  value: string
}

export type Movement = {
  key: string
  ledger: string
  date: string
  debitAccount: string
  creditAccount: string
  amount: number
}

import Dexie, { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

export const database = new Dexie('cruftbusters.com') as Dexie & {
  ledgers: EntityTable<LedgerData, 'key'>
  selections: EntityTable<Selection, 'key'>
  transfers: EntityTable<Movement, 'key'>
}

database.version(1).stores({
  ledgers: 'key',
  selections: 'key',
  transfers: 'key, ledger',
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

    const movements = await database.transfers
      .where({ ledger: key })
      .sortBy('date')

    return { ledgers, ledger: { ...ledger, movements } }
  })
}
