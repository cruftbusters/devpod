import { Route, Routes } from 'react-router-dom'
import { Bookkeeping } from './Books'
import { Contact } from './Contact'
import { Header } from './Header'
import { BookkeepingV2 } from './BookkeepingV2'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path={'/bookkeeping'} element={<Bookkeeping />} />
        <Route path={'/bookkeeping/v2'} element={<BookkeepingV2 />} />
        <Route index element={<Contact />} />
      </Routes>
    </>
  )
}

export default App
