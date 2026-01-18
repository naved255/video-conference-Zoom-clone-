import React from 'react'
import { useNavigate } from 'react-router-dom'


const Hero = () => {

    const navigate = useNavigate();

    function handleJoin() {
        navigate("/meetinglink");
    }

    return (
        <div className='p-7'>
            <p className='text-xl font-bold '>Providing Quality Video Call Just Like Quality Education</p>
            <form className='flex gap-1.5 px-0.5 py-1 items-center' action="">
                <input required type="text" className="px-4 py-2 border rounded-lg text-sm
                     focus:outline-none w-56 focus:ring-2 focus:ring-blue-500" placeholder='meeting_code' name='code' />
                <button
                onClick={handleJoin}
                    type="submit"
                    className="px-3.5 py-1.5 bg-blue-600 text-white font-medium
                   rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Join
                </button>
            </form>
        </div>
    )
}

export default Hero