import { useState } from 'react'
import { HeaderedSheet } from './HeaderedSheet'
import { MarginAround } from './MarginAround'
import { parseAmount } from './parseAmount'
import { TextSheet } from './TextSheet'
import { Amount2 } from './types'
import { formatAmount } from './formatAmount'

export function BookkeepingV3() {
  const [summary, setSummary] = useState(new Map<string, Amount2>())
  return (
    <>
      <MarginAround>
        <h2>Bookkeeping v3</h2>
      </MarginAround>
      <MarginAround>
        <label>
          {' text sheet: '}
          <div>
            <textarea
              onChange={(e) => {
                const sheet = HeaderedSheet.fromTextSheet(
                  ['debitAccount', 'creditAccount', 'amount'],
                  TextSheet.fromText(e.target.value),
                )
                const summary = new Map()
                for (const [debitAccount, creditAccount, amountText] of sheet) {
                  const amount = parseAmount(amountText)
                  summary.set(debitAccount, amount)
                  summary.set(creditAccount, { ...amount, sign: -amount.sign })
                }
                setSummary(summary)
              }}
            />
          </div>
        </label>
      </MarginAround>
      <MarginAround>
        <h3>Summary</h3>
        {' total: empty '}
        {Array.from(summary.entries()).map(([account, amount]) => (
          <div key={account}>
            {account}
            {': '}
            {formatAmount(amount)}
          </div>
        ))}
      </MarginAround>
    </>
  )
}
