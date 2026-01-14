import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import AuthPage from './pages/Auth/AuthPage'
import DashboardPage from './pages/dashboard/dashboardPage'

function App() {


  return (
    <>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/auth' element={<AuthPage/>}/>
        <Route path='/dashboard/*' element={<DashboardPage/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
