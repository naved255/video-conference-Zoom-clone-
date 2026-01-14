import React from 'react'
import { useNavigate } from 'react-router-dom'

const SideImage = () => {

  const navigate = useNavigate();

  function handleNavigate() {
    navigate('/');
  }
  return (
    <div className='bg-[url(/SideImage.jpg)] flex justify-start  bg-cover bg-center w-full h-screen'>
      <div className='w-full px-2 py-3 bg-black/45'>
        <svg onClick={handleNavigate} className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill="white"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg></div>
    </div>
  )
}

export default SideImage