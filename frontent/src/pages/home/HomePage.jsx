import React from 'react'
import Hero from './Hero'
import ImageSection from './ImageSection'
import Navbar from '../Navbar'

const HomePage = () => {

    const links = [
        {
            path:"/",
            title: "Join as Guest"
        },
        {
            path:"/auth",
            title:"Register"
        },
        {
            path:"/auth",
            title:"Login"
        }
    ]
  return (
    <div class="bg-[url('/earth.webp')] bg-cover bg-top h-screen">
        <div className='absolute w-full h-full bg-black opacity-50'></div>
        <Navbar title={"Video Conference"} links={links}/>
        <div className='absolute w-full h-full grid max-w-390 content-center grid-cols-2'>
            
            <div className='col-span-1 px-10 content-center'>
                <Hero/>
            </div>
            <div className='col-span-1 flex justify-end px-5'>
                <ImageSection/>
            </div>
        </div>
        
    </div>
  )
}

export default HomePage