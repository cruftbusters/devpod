import { Transfer } from './database'

export function LedgerSummary({
  ledger,
}: {
  ledger?: { transfers: Transfer[] }
}) {
  return (
    <>
      <h3>Ledger Summary</h3>
      <div>there are {ledger?.transfers.length || 'no'} transfers</div>
    </>
  )
}
