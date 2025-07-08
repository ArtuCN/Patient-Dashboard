import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Patients from './components/Patients'

export const path = 'https://mobile.digistat.it/CandidateApi';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Patients />
    </>
  )
}

export default App
