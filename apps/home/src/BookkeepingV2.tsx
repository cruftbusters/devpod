import { MarginAround } from './MarginAround'
import { TextSheet } from './TextSheet'
import { useState } from 'react'
import { Balance } from './types'
import { Summary } from './Summary'
import { AmountFormat } from './AmountFormat'

export function BookkeepingV2() {
  const [balance, setBalance] = useState<Balance>()
  return (
    <>
      <MarginAround>
        <h2>Bookkeeping With Tests</h2>
      </MarginAround>
      <MarginAround>
        <label>
          {' text sheet: '}
          <div>
            <textarea
              onChange={(e) => {
                const sheet = TextSheet.fromText(e.target.value)
                const balance = Summary.fromTextSheet(sheet)
                setBalance(balance)
              }}
            />
          </div>
        </label>
      </MarginAround>
      <MarginAround>
        <h3>Summary</h3>
        {balance && <BalanceView name={'total'} balance={balance} />}
      </MarginAround>
    </>
  )
}

function BalanceView({ name, balance }: { name: string; balance: Balance }) {
  const amountText = AmountFormat.format(balance)

  return (
    <div>
      {` ${name}: ${amountText} `}
      <div style={{ marginLeft: '1em' }}>
        {balance.children &&
          Array.from(balance.children.entries()).map(([key, balance]) => (
            <BalanceView key={key} name={key} balance={balance} />
          ))}
      </div>
    </div>
  )
}
