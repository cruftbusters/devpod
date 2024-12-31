import {
  Ledger,
  LedgerOperations,
  Movement,
  MovementOperations,
  Transfer,
  TransferOperations,
} from './database'
import { v4 as uuidv4 } from 'uuid'
import { Grid, GridRow } from './Grid'
import { MarginAboveBelow } from '../MarginAround'
import { Fragment } from 'react/jsx-runtime'

export function MovementEditor({ ledger }: { ledger?: Ledger }) {
  return (
    ledger === undefined || (
      <>
        <h3>Transfer Editor</h3>
        <MarginAboveBelow>
          <EditorGrid ledger={ledger} />
        </MarginAboveBelow>
      </>
    )
  )
}

function EditorGrid({ ledger }: { ledger: Ledger }) {
  return (
    ledger.movements === undefined || (
      <Grid
        style={{
          gridTemplateColumns: 'repeat(7, auto)',
        }}
      >
        {ledger.movements?.length < 1 || (
          <>
            <GridRow>
              <div />
              <div>Date</div>
              <div>Debit Account</div>
              <div>Credit Account</div>
              <div>Amount</div>
            </GridRow>
            {ledger.movements.map((movement) => {
              const dispatch = MovementOperations(movement)
              return (
                <Fragment key={movement.key}>
                  <GridRow>
                    <button onClick={() => dispatch.remove()}>&times;</button>
                    <input
                      onChange={(e) =>
                        dispatch.put({
                          ...movement,
                          date: e.target.value,
                        })
                      }
                      placeholder="date"
                      value={movement.date}
                    />
                    <TransferEditor
                      movement={movement}
                      transfer={movement.transfers[0]}
                      index={0}
                    />
                  </GridRow>
                  {movement.transfers.slice(1).map((transfer, index) => (
                    <GridRow key={index}>
                      <div />
                      <div />
                      <TransferEditor
                        movement={movement}
                        transfer={transfer}
                        index={index + 1}
                      />
                    </GridRow>
                  ))}
                </Fragment>
              )
            })}
          </>
        )}
        <GridRow>
          <button
            onClick={() => {
              LedgerOperations().insert({
                key: uuidv4(),
                ledger: ledger.key,
                date: new Date().toISOString(),
                transfers: [
                  {
                    debitAccount: '',
                    creditAccount: '',
                    amount: 0,
                  },
                ],
              })
            }}
            style={{ padding: '0.25em 0.5em' }}
          >
            {ledger.movements.length > 0 ? '+' : 'Create new movement'}
          </button>
        </GridRow>
      </Grid>
    )
  )
}

function TransferEditor({
  movement,
  transfer,
  index,
}: {
  movement: Movement
  transfer: Transfer
  index: number
}) {
  const dispatch = TransferOperations(movement, index)
  return (
    <>
      <input
        onChange={(e) =>
          dispatch.put({
            ...transfer,
            debitAccount: e.target.value,
          })
        }
        placeholder="debit account"
        value={transfer.debitAccount}
      />
      <input
        onChange={(e) =>
          dispatch.put({
            ...transfer,
            creditAccount: e.target.value,
          })
        }
        placeholder="credit account"
        value={transfer.creditAccount}
      />
      <input
        onChange={(e) =>
          dispatch.put({
            ...transfer,
            amount: parseInt(e.target.value),
          })
        }
        placeholder="amount"
        value={transfer.amount === 0 ? '' : transfer.amount.toString()}
      />
      <button
        onClick={() =>
          dispatch.insert({
            debitAccount: '',
            creditAccount: '',
            amount: 0,
          })
        }
      >
        +
      </button>
      <button onClick={() => dispatch.remove()}>&times;</button>
    </>
  )
}
