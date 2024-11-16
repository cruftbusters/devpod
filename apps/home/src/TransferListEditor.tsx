import { database, Ledger, Transfer } from './database'
import { v4 as uuidv4 } from 'uuid'
import { Grid, GridRow } from './Grid'

export function TransferListEditor({
  ledger,
}: {
  ledger?: Ledger & { transfers: Transfer[] }
}) {
  return (
    ledger === undefined || (
      <>
        {ledger?.transfers === undefined || ledger?.transfers?.length < 1 || (
          <div>
            <TransferListEditorGrid ledger={ledger} />
          </div>
        )}
        <div style={{ margin: '1em 0' }}>
          <button
            onClick={() => {
              database.transfers.add({
                key: uuidv4(),
                ledger: ledger.key,
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
      </>
    )
  )
}

function TransferListEditorGrid({
  ledger,
}: {
  ledger: Ledger & { transfers: Transfer[] }
}) {
  return (
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
      {ledger.transfers.map((transfer) => (
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
            value={transfer.amount === 0 ? '' : transfer.amount.toString()}
          />
          <button onClick={() => database.transfers.delete(transfer.key)}>
            &times;
          </button>
        </GridRow>
      ))}
    </Grid>
  )
}
