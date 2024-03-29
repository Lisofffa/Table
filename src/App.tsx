// src/App.tsx
import React, { useEffect, useState } from 'react'
import CompanyTable from './components/CompanyTable'
import EmployeeTable from './components/EmployeeTable'

import './App.css'
const App: React.FC = () => {
  const [visibleCompanies, setVisibleCompanies] = useState<number>(7)
  const [visibleEmployees, setVisibleEmployees] = useState<number>(10)
  const handleScroll = () => {
    const scrolledHeight = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    if (scrolledHeight + windowHeight >= documentHeight) {
      setVisibleCompanies((prev) => prev + 4)
      setVisibleEmployees((prev) => prev + 7)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <div className="app">
      <div className="table-container">
        <CompanyTable visibleCompanies={visibleCompanies} />
      </div>
      <div className="table-container">
        <EmployeeTable visibleEmployees={visibleEmployees} />
      </div>
    </div>
  )
}

export default App
