import React, { useContext, useState } from 'react'
import API from '../../../config/api.js';
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../../GeneralProvider.jsx';
import axios from 'axios'

const Login = () => {

  const { setusername } = useContext(GeneralContext);

  const [submitting, setsubmitting] = useState(false);

  const [form, setform] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate()

  function handleChange(e) {
    setform(prev => (
      {
        ...prev,
        [e.target.name]: e.target.value
      }
    ))
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setsubmitting(true);
      let res = await axios.post(`${API}/user/login`, form, {withCredentials:true});
      if (!res.data?.status) {
        console.log(res.data.message);
        return;
      }
      setusername(res.data.username);
      console.log(res.data);
      navigate("/dashboard");

    } catch (error) {
      console.log(error);
    } finally {
      setsubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center py-6 px-4 min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
          Login to your account
        </h2>
        <p className="text-sm sm:text-base text-gray-500 text-center mt-2">
          Login to start your video conference
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              required
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              value={form.username}  // fixed bug here
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition duration-150"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={form.password}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition duration-150"
            />
          </div>

          {/* Submit */}
          <button
            disabled={submitting}
            type="submit"
            className={`w-full py-2.5 bg-blue-600 text-white font-medium
                   rounded-lg hover:bg-blue-700 transition duration-200
                   ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default Login
