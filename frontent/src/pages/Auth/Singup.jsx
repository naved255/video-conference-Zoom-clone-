import React, { useState } from 'react'
import axios from 'axios'
import API from '../../../config/api.js';

const Singup = () => {

  const [form, setform] = useState({
    name: "",
    username: "", // email
    password: ""
  });

  const [submitting, setsubmitting] = useState(false);

  function handleChange(e) {
    setform(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setsubmitting(true);

      // Make API call
      let res = await axios.post(`${API}/user/signup`, form, { withCredentials: true });

      if (!res.data?.status) {
        console.log(res.data.message);
        return;
      }

      console.log(res.data);
      alert("Account created successfully! You can now log in.");

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
          Create your account
        </h2>
        <p className="text-sm sm:text-base text-gray-500 text-center mt-2">
          Sign up to start video conferencing with your friends
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              name="name"
              onChange={handleChange}
              value={form.name}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition duration-150"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              name="username"
              onChange={handleChange}
              value={form.username}  // fixed bug
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
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Singup
