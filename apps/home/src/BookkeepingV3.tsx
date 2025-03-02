import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { MarginAround } from './MarginAround'
import { useStatus } from './bookkeeping_v2/useStatus'
import { Listicle } from './Listicle'
import { database, Journal } from './Journal'
import { TransferArraySheet } from './Transfer'
import { SheetSerde } from './SheetSerde'

export function BookkeepingV3() {
  const [key, setKey] = useState('')

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

  return (
    <MarginAround>
      <h2>Bookkeeping v3</h2>
      {keys && (
        <JournalList
          journalKey={key}
          journalKeys={keys}
          onJournalKeyChange={(key) => setKey(key)}
        />
      )}
      <JournalView journalKey={key} />
    </MarginAround>
  )
}

function JournalList({
  journalKey,
  journalKeys,
  onJournalKeyChange,
}: {
  journalKey: string
  journalKeys: string[]
  onJournalKeyChange: (key: string) => void
}) {
  return (
    <p>
      <label>
        {' select journal: '}
        <select
          onChange={(e) => onJournalKeyChange(e.target.value)}
          value={journalKey}
        >
          {journalKey === '' && <option value={''} />}
          {journalKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>
      <button
        aria-label={'create journal'}
        onClick={async () => {
          let index = 1
          if (journalKeys.indexOf('new journal') > -1) {
            for (
              index += 1;
              journalKeys.indexOf(`new journal (${index})`) > -1;
              index++
            ) {
              /* eslint-disable-no-empty */
            }
          }
          const suffix = index === 1 ? '' : ` (${index})`
          const key = 'new journal' + suffix
          await database.journals.put({ key, transfers: [] })
          onJournalKeyChange(key)
        }}
      >
        +
      </button>
    </p>
  )
}

function JournalView({ journalKey }: { journalKey?: string }) {
  const status = useStatus()

  const journal = useLiveQuery(async () => {
    if (journalKey !== undefined) {
      try {
        status.info('loading journal')
        const result = await database.journals.get(journalKey)
        if (result === undefined) {
          status.info('ready to load journal')
        } else {
          status.info('loaded journal')
          return new Journal(journalKey, result.transfers || [])
        }
      } catch (cause) {
        status.error('failed to load journal', cause)
      }
    }
  }, [journalKey])

  return (
    <>
      <p>{status.message}</p>
      {journal !== undefined && (
        <>
          <JournalEditor journal={journal} />
          <JournalImportExport journal={journal} />
          <JournalSummary journal={journal} />
        </>
      )}
    </>
  )
}

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
              className="grid-cell"
              style={{
                padding: '0.25em 0.5em',
                textAlign: 'right',
              }}
            >
              {index}
            </div>
            {Object.keys(transfer).map((field) => (
              <input
                aria-label={field}
                className="grid-cell"
                key={field}
                onChange={(e) =>
                  journal.updateTransfer(index, (transfer) => ({
                    ...transfer,
                    [field]: e.target.value,
                  }))
                }
                value={(transfer as Record<string, string>)[field]}
              />
            ))}
            <button
              aria-label={'delete'}
              className="grid-cell"
              onClick={() => journal.deleteTransfer(index)}
              style={{ borderRadius: 0 }}
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

function JournalImportExport({ journal }: { journal: Journal }) {
  const status = useStatus()
  const [text, setText] = useState('')

  return (
    <>
      <p>
        <textarea
          aria-label="journal import and export tsv"
          onChange={(e) => setText(e.target.value)}
          value={text}
          style={{ gridColumn: '1/-1' }}
        />
      </p>
      <p>
        <Listicle>
          <button
            onClick={() => {
              try {
                const sheet = TransferArraySheet.toSheet(journal.transfers)
                const text = SheetSerde.serialize(sheet)
                setText(text)
                status.clear()
              } catch (cause) {
                status.error('failed to serialize transfers', cause)
              }
            }}
          >
            export
          </button>
          <button
            onClick={() => {
              try {
                const sheet = SheetSerde.deserialize(text)
                const transfers = TransferArraySheet.toArray(sheet)
                journal.setTransfers(transfers)
                status.clear()
              } catch (cause) {
                status.error('failed to deserialize transfers', cause)
              }
            }}
          >
            import
          </button>
          <button
            onClick={() =>
              setText((text) => {
                const lines = text.split('\n')
                return [lines[0]].concat(
                  lines.filter((_, index) => index > 0).reverse(),
                ).join('\n')
              })
            }
          >
            reverse
          </button>
        </Listicle>
      </p>
      <p>{status.message}</p>
    </>
  )
}

function JournalSummary({ journal }: { journal: Journal }) {
  const status = useStatus()
  const summary = useMemo(() => {
    try {
      const summary = journal.periods((date) => date?.substring(0, 4))
      status.info('successfully summarized journal')
      return summary
    } catch (cause) {
      status.error('failed to summarize journal', cause)
      return { accounts: [], periods: [] }
    }
  }, [status, journal])

  return (
    <>
      <h3>summary</h3>
      <p>{status.message}</p>
      <div
        aria-label="summary"
        className="grid alternating"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${1 + summary.periods.length}, auto)`,
        }}
      >
        <div
          className="grid-row"
          style={{
            display: 'grid',
            gridColumn: '1/-1',
            gridTemplateColumns: 'subgrid',
          }}
        >
          <div>account</div>
          {summary.periods.map((period) => (
            <div key={period}>{period}</div>
          ))}
        </div>
        {summary.accounts.map(({ path, snapshots }) => (
          <div
            aria-label={path.join(':')}
            className="grid-row"
            key={path.join(':')}
            style={{
              display: 'grid',
              gridColumn: '1/-1',
              gridTemplateColumns: 'subgrid',
            }}
          >
            <div style={{ textIndent: `calc(${path.length - 1} * 1em)` }}>
              {path[path.length - 1]}
            </div>
            {summary.periods.map((period, index) => (
              <div key={period}>{snapshots[index]?.format()}</div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
