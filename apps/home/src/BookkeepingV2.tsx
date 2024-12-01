import { useState } from 'react'
import { HeaderedSheet } from './HeaderedSheet'
import { MarginAround } from './MarginAround'
import { parseAmount } from './parseAmount'
import { TextSheet } from './TextSheet'
import { formatAmount } from './formatAmount'
import { AccountBalances, accrueBalance } from './Balance'

export function BookkeepingV2() {
  const [balance, setBalance] = useState<AccountBalances>(new Map())
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
                const balance = new Map()
                for (const [debitAccount, creditAccount, amountText] of sheet) {
                  const amount = parseAmount(amountText)
                  try {
                    accrueBalance(balance, debitAccount.split(':'), amount)
                    accrueBalance(balance, creditAccount.split(':'), {
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
        <BalanceView balance={balance} />
        {error && <div>{`error: ${error}`}</div>}
      </MarginAround>
    </>
  )
}

function BalanceView({ balance }: { balance: AccountBalances }) {
  return Array.from(balance.entries()).map(
    ([account, { amount, accounts: children }]) => (
      <div key={account}>
        {account}
        {': '}
        {formatAmount(amount)}
        {children && (
          <div style={{ marginLeft: '1em' }}>
            <BalanceView balance={children} />
          </div>
        )}
      </div>
    ),
  )
}
