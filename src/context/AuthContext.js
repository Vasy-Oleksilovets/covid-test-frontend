// @ts-nocheck
import React, { useState, createContext, useEffect } from 'react'; 
import jwtDecode from 'jwt-decode';
import { useHistory } from "react-router-dom";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        if(localStorage.getItem('userToken')){
            setIsAuthenticated(true);
        }
    }, [])
    
    const login = () => {
        setIsAuthenticated(true);
    }

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('userToken');
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {props.children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider
