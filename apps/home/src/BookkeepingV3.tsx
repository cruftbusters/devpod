import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { MarginAround } from './MarginAround'
import { Amount } from './Amount'
import { useStatus } from './bookkeeping_v2/useStatus'

export function BookkeepingV3() {
  const journal = useJournal()

  return (
    <MarginAround>
      <h2>Bookkeeping v3</h2>
      <p>Welcome to v3</p>
      <Editor journal={journal} />
      <Summary journal={journal} />
    </MarginAround>
  )
}

type Transfer = { credit: string; debit: string; amount: string }

function useJournal() {
  const [transfers, setTransfers] = useState<Transfer[]>([])

  return useMemo(
    () => new Journal(transfers, setTransfers),
    [transfers, setTransfers],
  )
}

class Journal {
  constructor(
    public transfers: Transfer[],
    private setTransfers: Dispatch<SetStateAction<Transfer[]>>,
  ) {}

  addTransfer() {
    this.setTransfers((transfers) =>
      transfers.concat([{ credit: '', debit: '', amount: '' }]),
    )
  }

  updateTransfer(index: number, block: (transfer: Transfer) => Transfer) {
    this.setTransfers((transfers) =>
      transfers.map((transfer, k) =>
        k === index ? block(transfer) : transfer,
      ),
    )
  }
}

function Editor({ journal }: { journal: ReturnType<typeof useJournal> }) {
  return (
    <>
      <div
        className={'grid'}
        style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(6, auto)',
          gridGap: '1px',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            gridColumn: '1/-1',
            display: 'grid',
            gridTemplateColumns: 'subgrid',
            gridGap: '1em',
          }}
        >
          <span />
          <span>date</span>
          <span>memo</span>
          <span>credit</span>
          <span>debit</span>
          <span>amount</span>
        </div>
        {journal.transfers.map((transfer, index) => (
          <div
            aria-label={index}
            key={index}
            style={{
              gridColumn: '1/-1',
              display: 'grid',
              gridTemplateColumns: 'subgrid',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgb(43, 42, 51)',
                padding: '0.25em 0.5em',
                textAlign: 'right',
              }}
            >
              {index}
            </div>
            <input aria-label={'date'} />
            <input aria-label={'memo'} />
            <input
              aria-label={'credit'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  credit: e.target.value,
                }))
              }
              value={transfer.credit}
            />
            <input
              aria-label={'debit'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  debit: e.target.value,
                }))
              }
              value={transfer.debit}
            />
            <input
              aria-label={'amount'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  amount: e.target.value,
                }))
              }
              value={transfer.amount}
            />
          </div>
        ))}
      </div>
      <p>
        <button onClick={() => journal.addTransfer()}>add transfer</button>
      </p>
    </>
  )
}

function Summary({ journal }: { journal: ReturnType<typeof useJournal> }) {
  const status = useStatus()
  const summary = useMemo(() => {
    try {
      const summary = journal.transfers.reduce((accounts, transfer) => {
        const amount = Amount.parse(transfer.amount)
        const credit = accounts.get(transfer.credit)
        const debit = accounts.get(transfer.debit)
        return accounts
          .set(
            transfer.credit,
            credit ? credit.plus(amount.negate()) : amount.negate(),
          )
          .set(transfer.debit, debit ? debit.plus(amount) : amount)
      }, new Map<string, Amount>())
      status.info('successfully summarized journal')
      return summary
    } catch (cause) {
      status.error('failed to summarize journal', cause)
      return new Map()
    }
  }, [journal.transfers])

  return (
    <>
      <h3>summary</h3>
      <p>{status.message}</p>
      <div>
        {Array.from(summary.entries()).map(([account, amount]) => (
          <div key={account}>
            {` ${account} `}
            <span>{` ${amount.format()} `}</span>
          </div>
        ))}
      </div>
    </>
  )
}
