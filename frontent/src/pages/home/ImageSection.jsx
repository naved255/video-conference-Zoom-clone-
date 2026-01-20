import React from 'react'

const ImageSection = () => {
  return (
    <div
      className="
        bg-[url('/face.avif')]
        bg-cover bg-center
        rounded-full

        w-52 h-52
        sm:w-64 sm:h-64
        md:w-80 md:h-80
        lg:w-[28rem] lg:h-[28rem]

        shadow-2xl
      "
    />
  )
}

export default ImageSection
