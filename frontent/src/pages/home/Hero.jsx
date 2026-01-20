import React from 'react'
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  const navigate = useNavigate();

  function handleNavigate() {
    navigate('/auth');
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 max-w-xl">
      
      {/* Heading */}
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
        <span className="text-orange-400">Connect </span>
        <span className="text-white">with your loved ones</span>
      </h1>

      {/* Subtitle */}
      <p className="text-white/70 text-base sm:text-lg lg:text-xl">
        Cover the distance with video conferencing
      </p>

      {/* CTA Button */}
      <button
        onClick={handleNavigate}
        className="mt-4 w-fit bg-orange-400 px-6 py-3
                   rounded-md text-white font-bold
                   text-base sm:text-lg
                   hover:bg-orange-500 transition duration-200"
      >
        Get Started
      </button>

    </div>
  )
}

export default Hero
