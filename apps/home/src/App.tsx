import { Route, Routes } from 'react-router-dom'
import { BookkeepingV1 } from './BookkeepingV1'
import { Contact } from './Contact'
import { Header } from './Header'
import { BookkeepingV2 } from './BookkeepingV2'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path={'/bookkeeping/v1'} element={<BookkeepingV1 />} />
        <Route path={'/bookkeeping'} element={<BookkeepingV2 />} />
        <Route index element={<Contact />} />
      </Routes>
    </>
  )
}

export default App
