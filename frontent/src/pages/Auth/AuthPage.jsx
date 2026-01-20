import React from 'react'
import Navbar from '../Navbar.jsx'
import SideImage from './SideImage.jsx'
import AuthComponent from './AuthComponent.jsx'

const AuthPage = () => {
  return (
    <div className='grid grid-cols-3'>
        <div className='col-span-2'>
            <SideImage/>
        </div>
        <div className='col-span-1'>
            <AuthComponent/>
        </div>
        
    </div>
  )
}

export default AuthPage