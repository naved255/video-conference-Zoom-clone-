import React from 'react'
import { useNavigate } from 'react-router-dom'

const SideImage = () => {

  const navigate = useNavigate();

  function handleNavigate() {
    navigate('/');
  }

  return (
    <div className="relative w-full h-[60vh] md:h-screen bg-cover bg-center" style={{ backgroundImage: "url('/SideImage.jpg')" }}>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 flex items-start justify-start p-4 md:p-6">
        <svg
          onClick={handleNavigate}
          className="cursor-pointer h-10 w-10 md:h-12 md:w-12 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
        >
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
      </div>

    </div>
  )
}

export default SideImage
