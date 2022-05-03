export default function App() {
  return (
    <div style={{ color: '#EEE', height: '100%' }}>
      <div
        style={{
          fontSize: '2rem',
          textAlign: 'center',
          color: '#FAA',
          fontFamily: 'Titillium Web',
          padding: '0.25rem',
        }}
      >
        cruftbusters llc
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '4rem',
        }}
      >
        <Link href="mailto:tyler@cruftbusters.com">email us</Link>
        <Link href="https://github.com/cruftbusters">github</Link>
      </div>
    </div>
  )
}

function Block({ children }) {
  return (
    <div
      style={{
        maxWidth: '6in',
        margin: '0 auto',
        marginBottom: '1rem',
        padding: '0 1rem',
        textIndent: '1rem',
      }}
    >
      {children}
    </div>
  )
}

function Question({ children }) {
  return <span style={{ fontWeight: 'bold' }}>{children} </span>
}

function Link({ href, children }) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        fontSize: '1.5rem',
        color: '#AFF',
        backgroundColor: '#333',
        padding: '0.25rem 0.75rem',
        borderRadius: '0.125rem',
        textDecoration: 'none',
        margin: '0 0.125rem',
      }}
    >
      {children}
    </a>
  )
}
