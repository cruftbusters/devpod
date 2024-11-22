import { Link } from 'react-router-dom'
import { MarginAround } from './MarginAround'

export function Header() {
  return (
    <MarginAround>
      <header>
        <Link to="/" style={{ color: 'inherit' }}>
          <h1 style={{ margin: '0.125em 0' }}>Cruftbusters LLC</h1>
        </Link>
        <Link to="/bookkeeping">
          <span>bookkeeping</span>
        </Link>
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
