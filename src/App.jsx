import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import ListContactComponent from './components/ListContactComponent'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ContactComponent from './components/ContactComponent'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          {/* http://localhost:8080/api/v1/contacts */}
          <Route path='/' element={<ListContactComponent />}></Route>
          <Route path='/search' element={<ListContactComponent />}></Route>
          <Route path='/add-contact' element={<ContactComponent />}></Route>
          <Route path='/edit-contact/:id' element={<ContactComponent />}></Route>
        </Routes>
        
        <FooterComponent />
      </BrowserRouter>
    </>
  )
}

export default App
