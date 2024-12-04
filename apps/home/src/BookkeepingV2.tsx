import { useEffect, useState } from 'react'
import { HeaderedSheet } from './HeaderedSheet'
import { MarginAround } from './MarginAround'
import { parseAmount } from './parseAmount'
import { TextSheet } from './TextSheet'
import { formatAmount } from './formatAmount'
import { AccountBalances, accrueBalance } from './Balance'
import { VerticalTrack } from './VerticalTrack'
import { useStatus } from './useStatus'
import { Transfer } from './types'

export function BookkeepingV2() {
  const status = useStatus()

  const [text, setText] = useState('')
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [balance, setBalance] = useState<AccountBalances>(new Map())

  useEffect(() => {
    try {
      const sheet = HeaderedSheet.fromTextSheet(
        ['debitAccount', 'creditAccount', 'amount'],
        TextSheet.fromText(text),
      )

      const transfers = []

      for (const [debitAccount, creditAccount, amountText] of sheet) {
        const amount = parseAmount(amountText)
        transfers.push({ debitAccount, creditAccount, amount })
      }

      setTransfers(transfers)

      status.info('successfully parsed text sheet')
    } catch (cause) {
      status.error('failed to parse text sheet', cause)
    }
  }, [text])

  useEffect(() => {
    try {
      const balance = new Map()

      for (const { debitAccount, creditAccount, amount } of transfers) {
        accrueBalance(balance, debitAccount.split(':'), amount)
        accrueBalance(balance, creditAccount.split(':'), {
          ...amount,
          sign: -amount.sign,
        })
      }

      setBalance(balance)

      status.info('successfully summarized transfers')
    } catch (cause) {
      status.error('failed to summarize transfers', cause)
    }
  }, [transfers])

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
        {status.message && <p>{status.message}</p>}
      </MarginAround>
      <MarginAround>
        <h3>Summary</h3>
        <BalanceView balance={balance} />
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
