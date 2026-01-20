import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../../GeneralProvider.jsx';

const Hero = () => {

  const navigate = useNavigate();
  const { meetingCode, setmeetingCode } = useContext(GeneralContext);

  function handleJoin(e) {
    e.preventDefault();
    if (!meetingCode) return;
    navigate(`/${meetingCode}`);
  }

  return (
    <div className="p-6 sm:p-8 max-w-xl">
      
      {/* Heading */}
      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
        Providing quality video calls,
        <br className="hidden sm:block" />
        just like quality education
      </p>

      {/* Join Form */}
      <form
        onSubmit={handleJoin}
        className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <input
          required
          type="text"
          name="code"
          placeholder="Enter meeting code"
          value={meetingCode || ''}
          onChange={(e) => setmeetingCode(e.target.value)}
          className="
            w-full sm:w-64
            px-4 py-2.5
            border rounded-lg text-sm
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
        />

        <button
          type="submit"
          className="
            w-full sm:w-auto
            px-6 py-2.5
            bg-blue-600 text-white font-medium
            rounded-lg
            hover:bg-blue-700
            transition duration-200
          "
        >
          Join
        </button>
      </form>
    </div>
  )
}

export default Hero
