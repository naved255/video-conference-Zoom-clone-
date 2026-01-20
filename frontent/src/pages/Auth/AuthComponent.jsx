import React, { useState } from 'react'
import Login from './Login.jsx';
import Singup from './Singup.jsx';

const AuthComponent = () => {

    const [Auth, setAuth] = useState('signup');

    function handleClick(string) {
        setAuth(string);
    }

    return (
        <div>
            <div className='w-full px-3 py-3 flex justify-center items-center overflow-y-auto'>
                <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill="#2854C5"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Zm-80 160h160q17 0 28.5-11.5T600-360v-120q0-17-11.5-28.5T560-520v-40q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560v40q-17 0-28.5 11.5T360-480v120q0 17 11.5 28.5T400-320Zm40-200v-40q0-17 11.5-28.5T480-600q17 0 28.5 11.5T520-560v40h-80Z"/></svg>
            </div>
            <div className='flex gap-3 items-center justify-center mt-3'>
                <button onClick={() => {handleClick("login")}} className={`${Auth === 'login'?'text-white bg-blue-500':'text-black bg-white'} cursor-pointer px-2 py-1 font-bold`}>
                   Login
                </button>
                <button onClick={() => {handleClick("signup")}} className={`${Auth === 'signup'?'text-white bg-blue-500':'text-black bg-white '} cursor-pointer px-2 py-1 font-bold`}>
                   Sign up
                </button>
            </div>
            <div>
                {
                    Auth === 'login'? (
                        <Login/>
                    ):(
                        <Singup/>
                    )
                }
            </div>
        </div>
    )
}

export default AuthComponent