import React from 'react'
import Navbar from '../Navbar.jsx'
import SideImage from './SideImage.jsx'
import AuthComponent from './AuthComponent.jsx'

const AuthPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex flex-col h-screen md:flex-row min-h-[calc(100vh-64px)]">

        {/* Side Image - hidden on small screens */}
        <div className="hidden md:block md:w-2/3">
          <SideImage />
        </div>

        {/* Auth Form */}
        <div className="w-full md:w-1/3 overflow-y-auto flex items-center justify-center p-4">
          <AuthComponent />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
