import React, {useState} from 'react'

export const GeneralContext = React.createContext({
    username:null,
    setusername: () => {}
});

export const GeneralProvider = ({children}) => {
    const [username, setusername] = useState(null);

    return (
        <GeneralContext.Provider value={{username:username, setusername:setusername}}>
            {children}
        </GeneralContext.Provider>
    )
}