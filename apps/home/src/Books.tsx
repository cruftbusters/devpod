import { useLedgers } from './database'
import { MarginAboveBelow, MarginAround } from './MarginAround'
import { TransferListEditor } from './TransferListEditor'
import { LedgerListEditor } from './LedgerListEditor'

export function Bookkeeping() {
  const state = useLedgers()

  return (
    <MarginAround>
      <h2>Bookkeeping</h2>
      {state === undefined ? (
        'Loading ledgers'
      ) : (
        <>
          <div hidden={state.ledger !== undefined}>No ledger selected</div>
          <MarginAboveBelow>
            <LedgerListEditor {...state} />
          </MarginAboveBelow>
          <MarginAboveBelow>
            <TransferListEditor {...state} />
          </MarginAboveBelow>
        </>
      )}
    </MarginAround>
  )
}
