import { database, Ledger } from './database'
import { v4 as uuidv4 } from 'uuid'
import { Grid, GridRow } from './Grid'
import { MarginAboveBelow } from './MarginAround'

export function TransferEditor({ ledger }: { ledger?: Ledger }) {
  return (
    ledger === undefined || (
      <>
        <h3>Transfer Editor</h3>
        <MarginAboveBelow>
          <TransferListEditorGrid ledger={ledger} />
        </MarginAboveBelow>
        <MarginAboveBelow>
          <button
            onClick={() => {
              database.transfers.add({
                key: uuidv4(),
                ledger: ledger.key,
                date: new Date().toISOString(),
                debitAccount: '',
                creditAccount: '',
                amount: 0,
              })
            }}
            style={{ padding: '0.25em 0.5em' }}
          >
            Create new transfer
          </button>
        </MarginAboveBelow>
      </>
    )
  )
}

function TransferListEditorGrid({ ledger }: { ledger: Ledger }) {
  return (
    ledger.movements === undefined ||
    ledger.movements?.length < 1 || (
      <Grid
        style={{
          gridTemplateColumns: 'repeat(5, auto)',
        }}
      >
        <GridRow>
          <div>Date</div>
          <div>Debit Account</div>
          <div>Credit Account</div>
          <div>Amount</div>
        </GridRow>
        {ledger.movements.map((transfer) => (
          <GridRow key={transfer.key}>
            <input
              onChange={(e) =>
                database.transfers.put({
                  ...transfer,
                  date: e.target.value,
                })
              }
              placeholder="date"
              value={transfer.date}
            />
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
              value={transfer.amount === 0 ? '' : transfer.amount.toString()}
            />
            <button onClick={() => database.transfers.delete(transfer.key)}>
              &times;
            </button>
          </GridRow>
        ))}
      </Grid>
    )
  )
}
