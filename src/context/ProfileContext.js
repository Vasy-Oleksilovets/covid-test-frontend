// @ts-nocheck
import React, { useState, createContext, useEffect } from 'react'; 
import jwtDecode from 'jwt-decode';

export const ProfileContext = createContext();

const ProfileContextProvider = (props) => {
    const [userProfile, setUserProfile] = useState({});
    
    useEffect(() => {
        let token = localStorage.getItem('userToken')
        if(token){
            const decodedToken = jwtDecode(token);
            setUserProfile(decodedToken);
        }
    }, [])

    const setProfile = (data) => {
        setUserProfile(data);
    }

    return (
        <ProfileContext.Provider value={{userProfile, setProfile}}>
            {props.children}
        </ProfileContext.Provider>
    )
}

export default ProfileContextProvider
