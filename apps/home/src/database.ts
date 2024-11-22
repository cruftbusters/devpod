export type Ledger = {
  movements: Movement[]
} & LedgerData

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
  transfers: Transfer[]
}

export type Transfer = {
  debitAccount: string
  creditAccount: string
  amount: number
}

import Dexie, { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

export const database = new Dexie('cruftbusters.com/bookkeeping') as Dexie & {
  ledgers: EntityTable<LedgerData, 'key'>
  selections: EntityTable<Selection, 'key'>
  movements: EntityTable<Movement, 'key'>
}

database.version(1).stores({
  ledgers: 'key',
  selections: 'key',
  movements: 'key, ledger',
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

    const movements = await database.movements
      .where({ ledger: key })
      .sortBy('date')

    return { ledgers, ledger: { ...ledger, movements } }
  })
}

export function LedgerOperations() {
  function insert(movement: Movement) {
    database.movements.add(movement)
  }

  return { insert }
}

export function MovementOperations(movement: Movement) {
  function put(movement: Movement) {
    database.movements.put(movement)
  }
  function remove() {
    database.movements.delete(movement.key)
  }

  return { put, remove }
}

export function TransferOperations(movement: Movement, index: number) {
  function put(update: Transfer) {
    database.movements.put({
      ...movement,
      transfers: movement.transfers.map((check, k) =>
        k === index ? update : check,
      ),
    })
  }

  function insert(update: Transfer) {
    database.movements.put({
      ...movement,
      transfers: movement.transfers.flatMap((check, k) =>
        k === index ? [check, update] : [check],
      ),
    })
  }

  function remove() {
    if (movement.transfers.length > 1) {
      database.movements.put({
        ...movement,
        transfers: movement.transfers.filter((_, k) => k !== index),
      })
    } else {
      database.movements.delete(movement.key)
    }
  }

  return { put, insert, remove }
}
