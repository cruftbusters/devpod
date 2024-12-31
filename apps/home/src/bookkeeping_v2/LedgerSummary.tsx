import { Ledger } from './database'

export function LedgerSummary({ ledger }: { ledger?: Ledger }) {
  let count = 0
  const balance = { amount: 0 }
  for (const movement of ledger?.movements || []) {
    for (const transfer of movement.transfers) {
      count++
      accrue(balance, transfer.debitAccount.split(':'), transfer.amount)
      accrue(balance, transfer.creditAccount.split(':'), -transfer.amount)
    }
  }
  return (
    ledger === undefined || (
      <>
        <h3>Ledger Summary</h3>
        <div>there are {ledger.movements.length || 'no'} movements</div>
        <div>there are {count || 'no'} transfers</div>
        <BalanceView name={'total'} balance={balance} />
      </>
    )
  )
}

type Balance = { amount: number; children?: Map<string, Balance> }

function accrue(balance: Balance, path: string[], amount: number) {
  const token = path.shift()
  if (token !== undefined) {
    balance.children = balance.children || new Map()
    let child = balance.children.get(token)
    if (child === undefined) {
      child = { amount: 0 }
      balance.children.set(token, child)
    }
    accrue(child, path, amount)
  }

  balance.amount += amount
}

function BalanceView({
  name,
  balance: node,
}: {
  name: string
  balance: Balance
}) {
  return (
    <>
      {name}
      {': '}
      {node.amount}
      <br />
      {node.children === undefined || (
        <div style={{ marginLeft: '1em' }}>
          {Array.from(node.children.entries()).map(([name, node]) => (
            <BalanceView key={name} name={name} balance={node} />
          ))}
        </div>
      )}
    </>
  )
}
