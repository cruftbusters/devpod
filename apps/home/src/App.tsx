import { Route, Routes } from 'react-router-dom'
import { Contact } from './Contact'
import { Header } from './Header'
import { BookkeepingV1 } from './bookkeeping_v2/BookkeepingV1'
import { BookkeepingV2 } from './bookkeeping_v2/BookkeepingV2'
import { BookkeepingV3 } from './BookkeepingV3'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path={'/bookkeeping/v1'} element={<BookkeepingV1 />} />
        <Route path={'/bookkeeping/v2'} element={<BookkeepingV2 />} />
        <Route path={'/bookkeeping'} element={<BookkeepingV3 />} />
        <Route index element={<Contact />} />
      </Routes>
    </>
  )
}

export default App
