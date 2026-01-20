import React, { useContext } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../GeneralProvider.jsx'

const MeetingCode = () => {
  const { meetingCode, setmeetingCode } = useContext(GeneralContext)
  const navigate = useNavigate()

  const handleJoin = (e) => {
    e.preventDefault()
    navigate(`/${meetingCode}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Enter Meeting Code
        </h2>

        <form
          onSubmit={handleJoin}
          className="flex flex-col sm:flex-row gap-4"
        >
          <TextField
            label="Meeting Code"
            required
            fullWidth
            value={meetingCode || ''}
            onChange={(e) => setmeetingCode(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            className="!h-[56px] sm:!w-auto"
          >
            Connect
          </Button>
        </form>
      </div>
    </div>
  )
}

export default MeetingCode
