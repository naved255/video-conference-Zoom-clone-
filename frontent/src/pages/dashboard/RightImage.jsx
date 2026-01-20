import React from 'react'

const RightImage = () => {
  return (
    <div className="w-full flex justify-center">
      <img
        src="/cartoon.jpg"
        alt="cartoon"
        className="
          w-60 sm:w-72 md:w-96 lg:w-[32rem]
          max-w-full
          bg-white
          rounded-xl
          shadow-lg
        "
      />
    </div>
  )
}

export default RightImage
