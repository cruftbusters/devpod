import { Route, Routes } from 'react-router-dom'
import { Bookkeeping } from './Books'
import { Contact } from './Contact'
import { Header } from './Header'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path={'/bookkeeping'} element={<Bookkeeping />} />
        <Route index element={<Contact />} />
      </Routes>
    </>
  )
}

export default App
