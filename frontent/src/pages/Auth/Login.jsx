import React from 'react'

const Login = () => {
  return (
    <div className=" flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login to your account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          login to start video conference
        </p>

        {/* Form */}
        <form className="mt-6 space-y-5">


          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
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
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-medium
                   rounded-lg hover:bg-blue-700 transition duration-200"
          >
           Login
          </button>
        </form>

      </div>
    </div>

  )
}

export default Login