import { Link } from 'react-router-dom'
import { MarginAround } from './MarginAround'

export function Header() {
  return (
    <MarginAround>
      <header>
        <Link to="/" style={{ color: 'inherit' }}>
          <h1 style={{ margin: '0.125em 0' }}>Cruftbusters LLC</h1>
        </Link>
        <div
          style={{
            display: 'inline-grid',
            gridAutoColumns: 'auto',
            gridAutoFlow: 'column',
            gridGap: '1em',
          }}
        >
          <Link to="/bookkeeping">
            <span>bookkeeping</span>
          </Link>
          <Link to="/bookkeeping/v2">
            <span>v2</span>
          </Link>
          <Link to="/bookkeeping/v1">
            <span>v1</span>
          </Link>
        </div>
        <a
          hidden={true}
          href="https://ccfs.sos.wa.gov/#/expressAnnualReport/1593817"
        >
          {' WA UBI 604 960 276 '}
        </a>
        <a hidden={true} href="https://github.com/cruftbusters">
          {' github '}
        </a>
      </header>
    </MarginAround>
  )
}
