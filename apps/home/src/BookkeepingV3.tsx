import { SetStateAction, useMemo } from 'react'
import { MarginAround } from './MarginAround'
import { Amount } from './Amount'
import { useStatus } from './bookkeeping_v2/useStatus'
import { useLiveQuery } from 'dexie-react-hooks'
import Dexie, { EntityTable } from 'dexie'

export function BookkeepingV3() {
  const transfers =
    useLiveQuery(async () => {
      const journal = await database.journals.get('default')
      return journal?.transfers || []
    }) || []

  return (
    <MarginAround>
      <h2>Bookkeeping v3</h2>
      <p>Welcome to v3</p>
      <Editor transfers={transfers} />
      <Summary transfers={transfers} />
    </MarginAround>
  )
}

const database = new Dexie('cruftbusters.com/bookkeeping_v3') as Dexie & {
  journals: EntityTable<Journal, 'key'>
}

database.version(1).stores({
  journals: 'key',
})

type Journal = { key: string; transfers: Transfer[] }

type Transfer = {
  date: string
  memo: string
  credit: string
  debit: string
  amount: string
}

function Editor({ transfers }: { transfers: Transfer[] }) {
  const operations = new JournalOperations(transfers)
  return (
    <>
      <div
        className={'grid'}
        style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(7, auto)',
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
        {transfers.map((transfer, index) => (
          <div
            aria-label={index.toString()}
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
            <input
              aria-label={'date'}
              onChange={(e) =>
                operations.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  date: e.target.value,
                }))
              }
              value={transfer.date}
            />
            <input
              aria-label={'memo'}
              onChange={(e) =>
                operations.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  memo: e.target.value,
                }))
              }
              value={transfer.memo}
            />
            <input
              aria-label={'credit'}
              onChange={(e) =>
                operations.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  credit: e.target.value,
                }))
              }
              value={transfer.credit}
            />
            <input
              aria-label={'debit'}
              onChange={(e) =>
                operations.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  debit: e.target.value,
                }))
              }
              value={transfer.debit}
            />
            <input
              aria-label={'amount'}
              onChange={(e) =>
                operations.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  amount: e.target.value,
                }))
              }
              value={transfer.amount}
            />
            <button
              aria-label={'delete'}
              onClick={() => operations.deleteTransfer(index)}
              style={{ borderRadius: 0, backgroundColor: 'rgb(43, 42, 51)' }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <p>
        <button onClick={() => operations.addTransfer()}>add transfer</button>
      </p>
    </>
  )
}

class JournalOperations {
  constructor(private transfers: Transfer[]) {}

  private setTransfers(updateOrBlock: SetStateAction<Transfer[]>) {
    const update =
      typeof updateOrBlock === 'function'
        ? updateOrBlock(this.transfers)
        : updateOrBlock
    return database.journals.put({ key: 'default', transfers: update })
  }

  addTransfer() {
    this.setTransfers((transfers) =>
      transfers.concat([
        { date: '', memo: '', credit: '', debit: '', amount: '' },
      ]),
    )
  }

  deleteTransfer(deleteIndex: number) {
    this.setTransfers((transfers) =>
      transfers.filter((_, index) => index !== deleteIndex),
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

function Summary({ transfers }: { transfers: Transfer[] }) {
  const status = useStatus()
  const summary = useMemo(() => {
    try {
      const summary = transfers.reduce((accounts, transfer) => {
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
  }, [status, transfers])

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
