import { MarginAround } from '../MarginAround'
import { formatAmount } from './formatAmount'
import { AccountBalances } from './Balance'
import { VerticalTrack, VerticalTracks } from './VerticalTrack'
import { useLedger } from './useLedger'
import { Amount2, Transfer } from './types'
import { useState } from 'react'
import { parseAmount } from './parseAmount'
import { useStatus } from '../useStatus'

export function BookkeepingV2() {
  const ledger = useLedger()

  return (
    <>
      <MarginAround>
        <h2>Bookkeeping v2</h2>
      </MarginAround>
      <VerticalTracks>
        <VerticalTrack>
          <MarginAround>
            <h3>Introduction</h3>
            <p>The first line is for headers. It needs to be something like:</p>
            <p style={{ fontFamily: 'monospace' }}>
              debitAccount,creditAccount,amount
            </p>
            <p>
              All non-first lines must have values be delimited by commas or
              tabs like the header line. Here is an example of a line containing
              a transfer:
            </p>
            <p style={{ fontFamily: 'monospace' }}>
              bank fees,checking account, $ 10.00
            </p>
            <p>
              This button will prepopulate the example:
              <button
                onClick={() =>
                  ledger.setTransfers([
                    {
                      debitAccount: 'bank fees',
                      creditAccount: 'checking account',
                      amount: {
                        sign: 1,
                        prefix: '$',
                        digits: '1000',
                        precision: 2,
                        suffix: '',
                      },
                    },
                  ])
                }
              >
                {' load example '}
              </button>
            </p>
          </MarginAround>
          <MarginAround>
            <TransferEditorText ledger={ledger} />
          </MarginAround>
          <MarginAround>
            <TransferEditorGrid ledger={ledger} />
          </MarginAround>
        </VerticalTrack>
        <VerticalTrack>
          <MarginAround>
            <Summary ledger={ledger} />
          </MarginAround>
        </VerticalTrack>
      </VerticalTracks>
    </>
  )
}

function TransferEditorText({ ledger }: { ledger: ReturnType<typeof useLedger> }) {
  return (
    <>
      <h3>Transfer Editor (Text)</h3>
      <label>
        {' text sheet: '}
        <div>
          <textarea
            style={{ width: '100%', height: '5em' }}
            onChange={(e) => ledger.setText(e.target.value)}
            value={ledger.text}
          />
        </div>
      </label>
      {ledger.textStatus.message && <p>{ledger.textStatus.message}</p>}
    </>
  )
}

function TransferEditorGrid({ ledger }: { ledger: ReturnType<typeof useLedger> }) {
  function updateTransfer(
    index: number,
    update: (value: Transfer) => Transfer,
  ) {
    ledger.setTransfers(
      ledger.transfers.map((transfer, k) =>
        k === index ? update(transfer) : transfer,
      ),
    )
  }
  return (
    <>
      <h3>Transfer Editor (Grid)</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'subgrid',
            gridColumn: '1/-1',
          }}
        >
          <div>debit account</div>
          <div>credit account</div>
          <div>amount</div>
        </div>
        {ledger.transfers.map((transfer, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: 'subgrid',
              gridColumn: '1/-1',
            }}
          >
            <input
              value={transfer.debitAccount}
              onChange={(e) =>
                updateTransfer(index, (transfer) => ({
                  ...transfer,
                  debitAccount: e.target.value,
                }))
              }
            />
            <input
              value={transfer.creditAccount}
              onChange={(e) =>
                updateTransfer(index, (transfer) => ({
                  ...transfer,
                  creditAccount: e.target.value,
                }))
              }
            />
            <AmountEditor
              value={transfer.amount}
              onChange={(amount) =>
                updateTransfer(index, (transfer) => ({
                  ...transfer,
                  amount,
                }))
              }
            />
          </div>
        ))}
      </div>
      {ledger.transfersStatus.message && (
        <p>{ledger.transfersStatus.message}</p>
      )}
    </>
  )
}

function AmountEditor({
  value,
  onChange,
}: {
  value: Amount2
  onChange: (value: Amount2) => void
}) {
  const status = useStatus()
  const [localText, setLocalText] = useState('')
  return (
    <span>
      <input
        value={localText || formatAmount(value)}
        onChange={(e) => {
          try {
            const amount = parseAmount(e.target.value)
            onChange(amount)
            setLocalText('')
            status.clear()
          } catch (cause) {
            setLocalText(e.target.value)
            status.error('failed to parse amount', cause)
          }
        }}
      />
      <div>{status.message}</div>
    </span>
  )
}

function Summary({ ledger }: { ledger: ReturnType<typeof useLedger> }) {
  return (
    <>
      <h3>Summary</h3>
      <BalanceView summary={ledger.summary} />
      {ledger.summaryStatus.message && <p>{ledger.summaryStatus.message}</p>}
    </>
  )
}

function BalanceView({ summary }: { summary: AccountBalances }) {
  return Array.from(summary.entries()).map(
    ([account, { amount, accounts: children }]) => (
      <div key={account}>
        {account}
        {': '}
        {formatAmount(amount)}
        {children && (
          <div style={{ marginLeft: '1em' }}>
            <BalanceView summary={children} />
          </div>
        )}
      </div>
    ),
  )
}
