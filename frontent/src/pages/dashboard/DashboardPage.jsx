import React, { useContext, useEffect } from 'react'
import Navbar from '../Navbar'
import Hero from './Hero'
import RightImage from './RightImage'
import { Route, Routes } from 'react-router-dom'
import History from './History'
import { GeneralContext } from '../../GeneralProvider'
import axios from 'axios'
import API from '../../../config/api'


const DashboardPage = () => {

    const { username, setusername } = useContext(GeneralContext);

    useEffect(() => {
        async function isAuth() {
            let res = await axios.get(`${API}/isAuth`, { withCredentials: true });
            if (!res.data.status) {
                console.log("unAuthories");
                return;
            }

            setusername(res.data.username);

        }

        isAuth();
    }, [username])


    const links = [
        {
            path: "/dashboard/history",
            title: "History",
            svg: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" /></svg>,

        },
        {
            path: "",
            title: "Log Out",
            logout: true

        }
    ]
    return (
        <div>
            <Navbar title={`Welcome ${username}`} color="black" links={links} />
            <Routes>
                <Route path='/' element={<div className='grid grid-cols-2 content-center'>
                    <div className='col-span-1 px-2.5 py-10 content-center'>
                        <Hero />
                    </div>
                    <div className='col-span-1 px-2.5 py-10 content-center'>
                        <RightImage />
                    </div>
                </div>} />
                <Route path='/history' element={<History />} />
            </Routes>
        </div>
    )
}

export default DashboardPage