import React, {useState} from 'react'

export const GeneralContext = React.createContext({
    username:null,
    setusername: () => {},
    meetingCode:null,
    setmeetingCode: () => {}
});

export const GeneralProvider = ({children}) => {
    const [username, setusername] = useState(null);
    const [meetingCode, setmeetingCode] = useState(null)

    return (
        <GeneralContext.Provider value={{username:username, setusername:setusername, meetingCode, setmeetingCode}}>
            {children}
        </GeneralContext.Provider>
    )
}