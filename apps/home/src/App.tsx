function App() {
  return (
    <>
      <div className={'brand'} style={{ padding: '1em' }}>
        <h1>Cruftbusters LLC</h1>
      </div>
      <div style={{ margin: '1em' }}>
        <p>
          Building a product is a lot like playing in a jazz band. First we
          listen to what is going on around us. Then we perform what comes to
          us. After a few small iterations of this hopefully the whole room is
          grooving otherwise we try something new.
        </p>
        <p>Interested in jamming together? Say hi via my contacts below</p>
      </div>
      <div style={{ margin: '1em' }}>
        <h2>Meet the Team</h2>
        <h3>Tyler Johnson</h3>
        <h4>Principal</h4>
        <div>
          <a href="mailto:tyler@cruftbusters.com">tyler@cruftbusters.com</a>
        </div>
        <div>
          <a href="tel:+16123562513">(612) 356-2513</a>
        </div>
      </div>
      <div style={{ margin: '1em' }}>
        <h2>Useful Links</h2>
        <div>
          <a href="https://github.com/cruftbusters">github</a>
        </div>
        <a
          hidden={true}
          href="https://ccfs.sos.wa.gov/#/expressAnnualReport/1593817"
        >
          WA UBI 604 960 276
        </a>
      </div>
    </>
  )
}

export default App
