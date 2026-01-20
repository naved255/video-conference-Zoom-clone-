import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API from '../../../config/api.js'

const History = () => {

  const [history, sethistory] = useState([]);

  useEffect(() => {
    async function getHistory() {
      let res = await axios.get(`${API}/user/meeting/history`, { withCredentials: true });
      
      if (res.data?.status) {
        sethistory(res.data.data);
      }

    }

    getHistory();
  }, [])

  return (
    <div className='mt-14'>
      {
        history.length > 0 ? (
          history.map((item, idx) => (
            <div key={idx} className='flex w-full justify-around px-2 py-1 items-center'>
              <p>{item.meetingCode}</p>
              <p>{item.date}</p>
            </div>
          ))
        ) : (
          <p>no history yet</p>
        )
      }
    </div>
  )
}

export default History