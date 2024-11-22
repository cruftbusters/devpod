import { database, Ledger, LedgerData } from './database'
import { v4 as uuidv4 } from 'uuid'
import { Grid, GridRow } from './Grid'
import { Schema } from './Schema'

export function LedgerEditor({
  ledger,
  ledgers,
}: {
  ledger?: Ledger
  ledgers?: LedgerData[]
}) {
  return (
    ledgers === undefined || (
      <>
        <h3>Ledger Editor</h3>
        <Grid style={{ gridTemplateColumns: 'repeat(4,auto)' }}>
          <GridRow>
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
            {ledger === undefined || (
              <>
                <button onClick={() => Schema()._export(ledger.movements)}>
                  export
                </button>
                <button
                  onClick={() => {
                    if (ledger) {
                      database.selections.delete('ledgerKey')
                      database.ledgers.delete(ledger.key)
                    }
                  }}
                >
                  &times;
                </button>
              </>
            )}
          </GridRow>
          {ledger === undefined || (
            <>
              <GridRow>
                <label style={{ gridColumn: '1/-1' }}>
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
              </GridRow>
              <GridRow>
                <label style={{ gridColumn: '1/-1' }}>
                  {'import: '}
                  <input
                    onChange={async (e) => {
                      const movements = await Schema()._import(
                        ledger.key,
                        e.target.files,
                      )

                      await database.movements
                        .where({ ledger: ledger.key })
                        .delete()
                      await database.movements.bulkAdd(movements)
                    }}
                    value={undefined}
                    type={'file'}
                  />
                </label>
              </GridRow>
            </>
          )}
        </Grid>
      </>
    )
  )
}
