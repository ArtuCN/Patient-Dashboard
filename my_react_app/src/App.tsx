import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import TableComponent from './components/Table'
export const path = 'https://mobile.digistat.it/CandidateApi';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <TableComponent />
    </>
  )
}

export default App
