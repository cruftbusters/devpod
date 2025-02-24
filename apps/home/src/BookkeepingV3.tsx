import { SetStateAction, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Dexie, { EntityTable } from 'dexie'

import { MarginAround } from './MarginAround'
import { Amount } from './Amount'
import { useStatus } from './bookkeeping_v2/useStatus'

export function BookkeepingV3() {
  const keys = useLiveQuery(async () => {
    const result: string[] = []
    for (const key of await database.journals.toCollection().keys()) {
      if (typeof key !== 'string') {
        throw Error(`expected key of type string got '${key}'`)
      }
      result.push(key)
    }
    return result
  }, [])

  const [key, setKey] = useState('default')

  const journal = useLiveQuery(async () => {
    const result = await database.journals.get(key)
    const transfers = result?.transfers || []
    return new Journal(key, transfers)
  }, [key])

  return (
    <MarginAround>
      <h2>Bookkeeping v3</h2>
      {journal ? (
        <>
          {keys ? (
            <JournalList
              journal={journal}
              keys={keys}
              onSelect={(key) => setKey(key)}
            />
          ) : (
            <p>loading metadata</p>
          )}
          <JournalEditor journal={journal} />
          <JournalSummary journal={journal} />
        </>
      ) : (
        <p>loading journal</p>
      )}
    </MarginAround>
  )
}

function JournalList({
  journal,
  keys,
  onSelect,
}: {
  journal: Journal
  keys: string[]
  onSelect: (key: string) => void
}) {
  return (
    <p>
      <label>
        {' select journal: '}
        <select onChange={(e) => onSelect(e.target.value)} value={journal.key}>
          {keys.map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </label>
      <button
        aria-label={'create journal'}
        onClick={async () => {
          let index = 1
          if (keys.indexOf('new journal') > -1) {
            for (
              index += 1;
              keys.indexOf(`new journal (${index})`) > -1;
              index++
            ) {
              /* eslint-disable-no-empty */
            }
          }
          const suffix = index === 1 ? '' : ` (${index})`
          const key = 'new journal' + suffix
          await database.journals.put({ key, transfers: [] })
          onSelect(key)
        }}
      >
        +
      </button>
    </p>
  )
}

class Journal {
  constructor(
    public key: string,
    public transfers: Transfer[],
    private table = database.journals,
  ) {}

  private setTransfers(updateOrBlock: SetStateAction<Transfer[]>) {
    const update =
      typeof updateOrBlock === 'function'
        ? updateOrBlock(this.transfers)
        : updateOrBlock
    return this.table.put({ key: this.key, transfers: update })
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

type Transfer = {
  date: string
  memo: string
  credit: string
  debit: string
  amount: string
}

const database = new Dexie('cruftbusters.com/bookkeeping_v3') as Dexie & {
  journals: EntityTable<Journal, 'key'>
}

database.version(1).stores({
  journals: 'key',
})

function JournalEditor({ journal }: { journal: Journal }) {
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
        {journal.transfers.map((transfer, index) => (
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
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  date: e.target.value,
                }))
              }
              value={transfer.date}
            />
            <input
              aria-label={'memo'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  memo: e.target.value,
                }))
              }
              value={transfer.memo}
            />
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
            <button
              aria-label={'delete'}
              onClick={() => journal.deleteTransfer(index)}
              style={{ borderRadius: 0, backgroundColor: 'rgb(43, 42, 51)' }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <p>
        <button onClick={() => journal.addTransfer()}>add transfer</button>
      </p>
    </>
  )
}

function JournalSummary({ journal }: { journal: Journal }) {
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
  }, [status, journal.transfers])

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
