import React from 'react'
import Navbar from '../Navbar'
import SideImage from './SideImage'
import AuthComponent from './AuthComponent'

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