import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API from '../../../config/api.js'

const History = () => {

  const [history, sethistory] = useState([]);

  useEffect(() => {
    async function getHistory() {
      try {
        const res = await axios.get(
          `${API}/user/meeting/history`,
          { withCredentials: true }
        );

        if (res.data?.status) {
          sethistory(res.data.data);
        }
      } catch (err) {
        console.log("Failed to fetch history");
      }
    }

    getHistory();
  }, []);

  return (
    <div className="mt-16 px-4 sm:px-6 max-w-4xl mx-auto">

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
        Meeting History
      </h2>

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="
                flex flex-col sm:flex-row
                sm:items-center sm:justify-between
                gap-2
                bg-white
                rounded-lg
                shadow-sm
                border
                px-4 py-3
              "
            >
              <p className="font-medium text-gray-800">
                {item.meetingCode}
              </p>

              <p className="text-sm text-gray-500">
                {item.date}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg font-medium">
            No meeting history yet
          </p>
          <p className="text-sm mt-1">
            Your past meetings will appear here
          </p>
        </div>
      )}
    </div>
  )
}

export default History
