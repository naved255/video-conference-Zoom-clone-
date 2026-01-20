import React, { useContext } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../GeneralProvider'

const MeetingCode = () => {

    const { meetingCode, setmeetingCode } = useContext(GeneralContext);
    const navigate = useNavigate();

    const handleJoin = () => {
        navigate(`/${meetingCode}`);
    }

    return (
        <>
            <h2>Enter meeting code</h2>

            <form onSubmit={handleJoin}>
                <TextField
                    label="meeting_code"
                    required
                    value={meetingCode}
                    onChange={(e) => setmeetingCode(e.target.value)}
                />

                <Button
                    type="submit"
                    variant="contained"
                >
                    Connect
                </Button>
            </form>

        </>
    )
}

export default MeetingCode