import React, { useContext, useEffect } from 'react'
import Hero from './Hero.jsx'
import ImageSection from './ImageSection.jsx'
import Navbar from '../Navbar.jsx'
import { GeneralContext } from '../../GeneralProvider.jsx'
import axios from 'axios'
import API from '../../../config/api'

const HomePage = () => {

  const { username, setusername } = useContext(GeneralContext);

  useEffect(() => {
    async function isAuth() {
      try {
        const res = await axios.get(`${API}/isAuth`, {
          withCredentials: true
        });

        if (res.data?.status) {
          setusername(res.data.username);
        }
      } catch (err) {
        console.log("Not authenticated");
      }
    }

    isAuth();
  }, [username]); 

  const links = username === null
    ? [
        { path: "/meet", title: "Join as Guest" },
        { path: "/auth", title: "Register" },
        { path: "/auth", title: "Login" }
      ]
    : [
        { path: "/meet", title: "Join as Guest" },
        { path: "/dashboard", title: "Dashboard" }
      ];

  return (
    <div className="relative min-h-screen bg-[url('/earth.webp')] bg-cover bg-top">

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Navbar */}
      <Navbar title="Video Conference" links={links} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col-reverse
                      md:grid md:grid-cols-2
                      items-center
                      min-h-[calc(100vh-64px)]
                      px-6 sm:px-10">

        {/* Left: Hero */}
        <div className="w-full flex justify-center md:justify-start">
          <Hero />
        </div>

        {/* Right: Image */}
        <div className="w-full flex justify-center md:justify-end mb-10 md:mb-0">
          <ImageSection />
        </div>

      </div>
    </div>
  )
}

export default HomePage
