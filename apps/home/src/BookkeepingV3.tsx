import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { MarginAround } from './MarginAround'

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
      {journal.transfers.map((transfer, index) => (
        <div key={index}>
          {` ${index} `}
          <div>
            <label>
              {' date '}
              <input />
            </label>
            <label>
              {' memo '}
              <input />
            </label>
            <TextField
              name={'credit'}
              onChange={(credit) =>
                journal.updateTransfer(index, (transfer) => ({ ...transfer, credit }))
              }
              value={transfer.credit}
            />
            <TextField
              name={'debit'}
              onChange={(debit) =>
                journal.updateTransfer(index, (transfer) => ({ ...transfer, debit }))
              }
              value={transfer.debit}
            />
            <TextField
              name={'amount'}
              onChange={(amount) =>
                journal.updateTransfer(index, (transfer) => ({ ...transfer, amount }))
              }
              value={transfer.amount}
            />
          </div>
        </div>
      ))}
      <button onClick={() => journal.addTransfer()}>add transfer</button>
    </>
  )
}

function TextField({
  name,
  onChange,
  value,
}: {
  onChange: (text: string) => void
  value: string
  name: string
}) {
  return (
    <label>
      {` ${name} `}
      <input onChange={(e) => onChange(e.target.value)} value={value} />
    </label>
  )
}

function Summary({ journal }: { journal: ReturnType<typeof useJournal> }) {
  const summary = journal.transfers.reduce(
    (accounts, transfer) =>
      accounts
        .set(transfer.credit, `( ${transfer.amount} )`)
        .set(transfer.debit, transfer.amount),
    new Map<string, string>(),
  )

  return (
    <div>
      {' summary '}
      <div style={{ marginLeft: '1em' }}>
        {Array.from(summary.entries()).map(([account, amount]) => (
          <div key={account}>
            {` ${account} `}
            <div>{` ${amount} `}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
