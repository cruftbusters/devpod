export default function App() {
  return (
    <div style={{ backgroundColor: '#111', color: '#EEE', height: '100%' }}>
      <div
        style={{
          fontSize: '2em',
          textAlign: 'center',
          color: '#FAA',
          fontFamily: 'Titillium Web',
          padding: '0.25em',
        }}
      >
        cruftbusters llc
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link href="mailto:tyler@cruftbusters.com">email us</Link>
        <Link href="https://github.com/cruftbusters">github</Link>
      </div>
    </div>
  )
}

function Link({ href, children }) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        fontSize: '1.75em',
        color: '#AFF',
        backgroundColor: '#333',
        padding: '0.125em 0.75em',
        borderRadius: '0.125em',
        textDecoration: 'none',
        margin: '0 0.125em',
      }}
    >
      {children}
    </a>
  )
}
