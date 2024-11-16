import { MarginAround } from './MarginAround'

import { v4 as uuidv4 } from 'uuid'

type Transfer = {
  key: string
  timestamp: string
  debitAccount: string
  creditAccount: string
  amount: Number
}

import Dexie, { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { Grid, GridRow } from './Grid'

const database = new Dexie('cruftbusters.com') as Dexie & {
  transfers: EntityTable<Transfer, 'key'>
}

database.version(1).stores({ transfers: 'key, [timestamp+key]' })

export function Books() {
  const transfers = useLiveQuery(() => {
    return database.transfers.orderBy('[timestamp+key]').toArray()
  })
  return (
    <MarginAround>
      <h2>Bookkeeping</h2>
      <Grid
        style={{
          gridTemplateColumns: 'repeat(4, auto)',
        }}
      >
        <GridRow>
          <div>Debit Account</div>
          <div>Credit Account</div>
          <div>Amount</div>
        </GridRow>
        {transfers
          ? transfers.map((transfer) => (
              <GridRow key={transfer.key}>
                <input
                  onChange={(e) =>
                    database.transfers.put({
                      ...transfer,
                      debitAccount: e.target.value,
                    })
                  }
                  placeholder="debit account"
                  value={transfer.debitAccount}
                />
                <input
                  onChange={(e) =>
                    database.transfers.put({
                      ...transfer,
                      creditAccount: e.target.value,
                    })
                  }
                  placeholder="credit account"
                  value={transfer.creditAccount}
                />
                <input
                  onChange={(e) =>
                    database.transfers.put({
                      ...transfer,
                      amount: parseInt(e.target.value),
                    })
                  }
                  placeholder="amount"
                  value={
                    transfer.amount === 0 ? '' : transfer.amount.toString()
                  }
                />
                <button
                  onClick={() => database.transfers.delete(transfer.key)}
                  style={{ padding: '0.25em 0.5em' }}
                >
                  &times;
                </button>
              </GridRow>
            ))
          : 'Loading transfers'}
      </Grid>
      <div style={{ margin: '1em 0' }}>
        <button
          onClick={() => {
            database.transfers.add({
              key: uuidv4(),
              timestamp: new Date().toISOString(),
              debitAccount: '',
              creditAccount: '',
              amount: 0,
            })
          }}
          style={{ padding: '0.25em 0.5em' }}
        >
          Add transfer
        </button>
      </div>
    </MarginAround>
  )
}
