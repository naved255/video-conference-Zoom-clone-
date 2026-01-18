import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import AuthPage from './pages/Auth/AuthPage'
import DashboardPage from './pages/dashboard/dashboardPage'
import { GeneralProvider } from './GeneralProvider'
import VideoManager from './pages/videoConference/VideoManager'

function App() {


  return (
    <>
      <GeneralProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/dashboard/*' element={<DashboardPage />} />
            <Route path='/:meeting_code' element={<VideoManager/>}/>
          </Routes>
        </BrowserRouter>
      </GeneralProvider>
    </>
  )
}

export default App
