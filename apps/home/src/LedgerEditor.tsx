import { database, Ledger, Transfer } from './database'
import { v4 as uuidv4 } from 'uuid'
import { Grid } from './Grid'

export function LedgerEditor({
  ledger,
  ledgers,
}: {
  ledger?: Ledger & { transfers: Transfer[] }
  ledgers?: Ledger[]
}) {
  return (
    ledgers === undefined || (
      <>
        <h3>Ledger Editor</h3>
        <Grid
          style={{
            gridAutoColumns: 'auto',
            gridAutoFlow: 'column',
          }}
        >
          <button
            onClick={async () => {
              const key = uuidv4()
              database.selections.put({ key: 'ledgerKey', value: key })
              database.ledgers.add({ key, name: 'new ledger' })
            }}
          >
            Create new ledger
          </button>
          <select
            hidden={ledgers.length < 1}
            onChange={(e) =>
              database.selections.put({
                key: 'ledgerKey',
                value: e.target.value,
              })
            }
            value={ledger?.key || ''}
          >
            <option />
            {ledgers.map((ledger) => (
              <option key={ledger.key} value={ledger.key}>
                {ledger.name}
              </option>
            ))}
          </select>
          <label hidden={ledger === undefined}>
            {'name: '}
            <input
              onChange={(e) =>
                database.ledgers.put({
                  ...ledger,
                  name: e.target.value,
                })
              }
              value={ledger?.name || ''}
            />
          </label>
          <button
            hidden={ledger === undefined}
            onClick={() => {
              if (ledger) {
                database.selections.delete('ledgerKey')
                database.ledgers.delete(ledger.key)
              }
            }}
          >
            &times;
          </button>
        </Grid>
      </>
    )
  )
}
