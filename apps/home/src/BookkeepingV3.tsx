import { useState } from 'react'
import { HeaderedSheet } from './HeaderedSheet'
import { MarginAround } from './MarginAround'
import { parseAmount } from './parseAmount'
import { TextSheet } from './TextSheet'
import { formatAmount } from './formatAmount'
import { Balance } from './Balance'

export function BookkeepingV3() {
  const [balance, setBalance] = useState(new Balance())
  const [error, setError] = useState<string>()
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
                const balance = new Balance()
                for (const [debitAccount, creditAccount, amountText] of sheet) {
                  const amount = parseAmount(amountText)
                  try {
                    balance.accrue(debitAccount, amount)
                    balance.accrue(creditAccount, {
                      ...amount,
                      sign: -amount.sign,
                    })
                  } catch (cause) {
                    if (cause instanceof Error) {
                      setError(cause.message)
                    }
                  }
                }
                setBalance(balance)
              }}
            />
          </div>
        </label>
      </MarginAround>
      <MarginAround>
        <h3>Summary</h3>
        {' total: empty '}
        {Array.from(balance.accounts.entries()).map(([account, amount]) => (
          <div key={account}>
            {account}
            {': '}
            {formatAmount(amount)}
          </div>
        ))}
        {error && <div>{`error: ${error}`}</div>}
      </MarginAround>
    </>
  )
}
