import React, { useContext, useEffect } from 'react'
import Hero from './Hero.jsx'
import ImageSection from './ImageSection.jsx'
import Navbar from '../Navbar.jsx'
import { GeneralContext } from '../../GeneralProvider.jsx'
import axios from 'axios'
import API from '../../../config/api'

const HomePage = () => {

    const {username, setusername} = useContext(GeneralContext);

    useEffect(() => {
        async function isAuth() {
            let res = await axios.get(`${API}/isAuth`, {withCredentials:true});
            if(!res.data.status) {
                console.log("unAuthories");
                return;
            }

            setusername(res.data.username);

        }

        isAuth();
    }, [username])



    let links;
    username === null? links = [
        {
            path:"/meet",
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
    ]:links = [
        {
            path:"/meet",
            title: "Join as Guest"
        },
        {
            path:"/dashboard",
            title:"Dashboard"
        }
    ]

  return (
    <div className="bg-[url('/earth.webp')] bg-cover bg-top h-screen">
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