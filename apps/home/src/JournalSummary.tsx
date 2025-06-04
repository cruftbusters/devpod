import { useMemo, Fragment } from 'react'
import { useStatus } from './useStatus'
import { Journal } from './Journal'

export function JournalSummary({ journal }: { journal: Journal }) {
  const status = useStatus()
  const summary = useMemo(() => {
    try {
      const summary = journal.summary((date) => date?.substring(0, 4))
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
        style={{
          textWrap: 'nowrap',
          overflowX: 'auto',
        }}
      >
        <div
          className="alternating"
          style={{
            display: 'grid',
            position: 'absolute',
          }}
        >
          <div>account</div>
          {summary.accounts.map(({ path }) => (
            <div
              key={path.join(':')}
              style={{ textIndent: `calc(${path.length - 1} * 1em)` }}
            >
              {path[path.length - 1] || '(blank)'}
            </div>
          ))}
        </div>
        <div
          aria-label="summary"
          className="grid alternating"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${1 + 2 * summary.periods.length}, auto)`,
            gridGap: '0 1em',
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
              <Fragment key={period}>
                <div>{period}</div>
                <div />
              </Fragment>
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
                {path[path.length - 1] || '(blank)'}
              </div>
              {summary.periods.map((period, index) => {
                const amount = snapshots[index]
                const nextAmount = snapshots[index + 1]
                return (
                  <Fragment key={period}>
                    <div>{amount?.format()}</div>
                    <div>
                      {amount &&
                        nextAmount &&
                        nextAmount.plus(amount.negate()).format()}
                    </div>
                  </Fragment>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
