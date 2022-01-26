export default function App() {
  return (
    <div style={{ backgroundColor: '#111', color: '#EEE', height: '100%' }}>
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
      <Block>
        Cruftbusters LLC deploys Product Engineers with expertise in building
        and supporting durable software solutions. We have experience optimizing
        business bottlenecks, automating manual workflows, reducing software
        defects, and replacing expensive integrations.
      </Block>
      <Block>
        <Question>What is a Product Engineer?</Question>
        Product Engineers are software engineers with a product mindset. They
        think in terms of products and services determined to meet a customer or
        business need. They use code, infrastructure, and other tools as a means
        to meet business needs.
      </Block>
      <Block>
        <Question>
          Why do I want Product Engineers as part of my organization?
        </Question>
        Product Engineers are best suited to deliver high-quality products that
        are tailored to your business needs. They seek to deeply understand
        software users through trustful and respectful working relationships.
        Trust is maintained through frequent communication and tested solutions.
      </Block>
      <Block>
        <Question>How do Product Engineers work?</Question>
        Product Engineers find success through collaborative and
        confidence-building practices including Test-Driven Development and Pair
        Programming. They are skilled and graceful communicators with experience
        in highly-collaborative teams. They are also capable of mentoring a team
        towards these practices and goals.
      </Block>
      <Block>
        <Question>How do I get in contact with Cruftbusters?</Question>
        We are excited to hear from you! Send us an e-mail using the button
        below.
      </Block>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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
        margin: '0 auto',
        width: '50%',
        marginBottom: '1rem',
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
