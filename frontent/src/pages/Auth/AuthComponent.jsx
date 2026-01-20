import React, { useState } from 'react'
import Login from './Login.jsx';
import Singup from './Singup.jsx';

const AuthComponent = () => {

    const [Auth, setAuth] = useState('signup');

    function handleClick(string) {
        setAuth(string);
    }

    return (
        <div className=" flex flex-col items-center pt-48 justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            
            {/* Logo */}
            <div className='flex justify-center items-center mb-6'>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 sm:h-20 sm:w-20" 
                    viewBox="0 -960 960 960" 
                    fill="#2854C5"
                >
                    <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Zm-80 160h160q17 0 28.5-11.5T600-360v-120q0-17-11.5-28.5T560-520v-40q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560v40q-17 0-28.5 11.5T360-480v120q0 17 11.5 28.5T400-320Zm40-200v-40q0-17 11.5-28.5T480-600q17 0 28.5 11.5T520-560v40h-80Z"/>
                </svg>
            </div>

            {/* Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 items-center justify-center mb-6 w-full max-w-xs'>
                <button 
                    onClick={() => handleClick("login")} 
                    className={`w-full sm:w-auto text-center px-4 py-2 rounded font-bold transition-colors duration-200
                        ${Auth === 'login' ? 'text-white bg-blue-500 hover:bg-blue-600' : 'text-black bg-white border border-gray-300 hover:bg-gray-100'}`}>
                    Login
                </button>
                <button 
                    onClick={() => handleClick("signup")} 
                    className={`w-full sm:w-auto text-center px-4 py-2 rounded font-bold transition-colors duration-200
                        ${Auth === 'signup' ? 'text-white bg-blue-500 hover:bg-blue-600' : 'text-black bg-white border border-gray-300 hover:bg-gray-100'}`}>
                    Sign up
                </button>
            </div>

            {/* Form */}
            <div className="w-full max-w-md">
                {Auth === 'login' ? <Login /> : <Singup />}
            </div>
        </div>
    )
}

export default AuthComponent;
