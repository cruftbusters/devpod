import { useEffect, useState } from 'react'
import { HeaderedSheet } from './HeaderedSheet'
import { MarginAround } from './MarginAround'
import { parseAmount } from './parseAmount'
import { TextSheet } from './TextSheet'
import { formatAmount } from './formatAmount'
import { AccountBalances, accrueBalance } from './Balance'
import { VerticalTrack } from './VerticalTrack'

export function BookkeepingV2() {
  const [balance, setBalance] = useState<AccountBalances>(new Map())
  const [error, setError] = useState<string>()
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const sheet = HeaderedSheet.fromTextSheet(
        ['debitAccount', 'creditAccount', 'amount'],
        TextSheet.fromText(text),
      )

      const balance = new Map()

      for (const [debitAccount, creditAccount, amountText] of sheet) {
        const amount = parseAmount(amountText)
        accrueBalance(balance, debitAccount.split(':'), amount)
        accrueBalance(balance, creditAccount.split(':'), {
          ...amount,
          sign: -amount.sign,
        })
      }

      setBalance(balance)
      setError('')
    } catch (cause) {
      let message = 'failed to summarize text sheet'
      if (cause instanceof Error) {
        message += ': ' + cause.message
      }
      console.error(message, cause)
      setError(message)
    }
  }, [text])

  return (
    <VerticalTrack>
      <MarginAround>
        <h2>Bookkeeping v2</h2>
        <p>The first line is for headers. It needs to be something like:</p>
        <p style={{ fontFamily: 'monospace' }}>
          debitAccount,creditAccount,amount
        </p>
        <p>
          All non-first lines must have values be delimited by commas or tabs
          like the header line. Here is an example of a line containing a
          transfer:
        </p>
        <p style={{ fontFamily: 'monospace' }}>
          bank fees,checking account, $ 10.00
        </p>
        <p>
          This button will prepopulate the example:
          <button
            onClick={() =>
              setText(
                'debitAccount,creditAccount,amount\nbank fees,checking account, $ 10.00 ',
              )
            }
          >
            {' load example '}
          </button>
        </p>
      </MarginAround>
      <MarginAround>
        <label>
          {' text sheet: '}
          <div>
            <textarea
              style={{ width: '100%', height: '5em' }}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          </div>
        </label>
      </MarginAround>
      <MarginAround>
        <h3>Summary</h3>
        <BalanceView balance={balance} />
        {error && <div>{`error: ${error}`}</div>}
      </MarginAround>
    </VerticalTrack>
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
