import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage.jsx'
import AuthPage from './pages/Auth/AuthPage.jsx'
import DashboardPage from './pages/dashboard/dashboardPage.jsx'
import { GeneralProvider } from './GeneralProvider.jsx'
import VideoManager from './pages/videoConference/VideoManager.jsx'
import MeetingCode from './pages/MeetingCode.jsx'

function App() {


  return (
    <>
      <GeneralProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/meet' element={<MeetingCode/>}/>
            <Route path='/dashboard/*' element={<DashboardPage />} />
            <Route path='/:meeting_code' element={<VideoManager/>}/>
          </Routes>
        </BrowserRouter>
      </GeneralProvider>
    </>
  )
}

export default App
