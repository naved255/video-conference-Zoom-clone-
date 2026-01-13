import React from 'react'

const Hero = () => {
    return (
        <div className='flex flex-col gap-1'>
            <div className='text-4xl font-bold '>
                <span className='text-orange-400'>Connect </span>
                <span className='text-white'>with your loved Ones</span>
            </div>
            <p className='text-white opacity-70 text-xl'>Cover a distance by video Conference</p>
            <button className='bg-orange-400 px-1 py-2 w-30 mt-3 cursor-pointer rounded-md text-white font-bold text-xl'>Get Started</button>

        </div>
    )
}

export default Hero