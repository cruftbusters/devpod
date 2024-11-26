import { MarginAround } from './MarginAround'
import { TextSheet } from './TextSheet'
import { useState } from 'react'
import { Balance } from './types'
import { Summary } from './Summary'
import { MoneyFormat } from './MoneyFormat'

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
  const formattedBalance = MoneyFormat.format(balance)

  return (
    <div>
      {` ${name}: ${formattedBalance}`}
      <div style={{ marginLeft: '1em' }}>
        {balance.children &&
          Array.from(balance.children.entries()).map(([key, balance]) => (
            <BalanceView key={key} name={key} balance={balance} />
          ))}
      </div>
    </div>
  )
}

function commas(digits: string) {
  const result = []
  for (let index = 0; index < digits.length; index++) {
    result.unshift(digits[digits.length - 1 - index])
    if (index % 3 === 2 && index < digits.length - 1) {
      result.unshift(',')
    }
  }
  return result.join('')
}
