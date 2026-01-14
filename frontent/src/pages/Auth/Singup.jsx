import React, { useState } from 'react'
import axios from 'axios'
import API from '../../../config/api';


const Singup = () => {

  const [form, setform] = useState({
    name: "",
    username: "",
    password: ""
  });

  const [submitting, setsubmitting] = useState(false);

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
      let res = await axios.post(`${API}/user/signup`, { form }, {withCredentials:true});
      if (!res.data?.status) {
        console.log(res.data.message);
        return;
      }
      console.log(res.data);
     alert("Account created successfully\nNow you can log in to your dashboard");

    } catch (error) {
      setsubmitting(false);
      console.log(error);
    } finally {
      setsubmitting(false);
    }
  }

  return (
    <div className=" flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create your account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Sign up to start video conference with your friends
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={form.name}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              id="username"
              onChange={handleChange}
              value={form.email}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
          disabled={submitting}
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-medium
                   rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create Account
          </button>
        </form>

      </div>
    </div>
  )
}

export default Singup