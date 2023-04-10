import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
const AuthenticateUser = ({children}) => {
    const user = JSON.parse(localStorage.getItem("userData")) 
    // let cookies = Cookies.get('_info')
    // var decoded = jwt_decode(cookies);
    // console.log("Decoded Cookies",decoded);

    if(user){
        return children
    }
    else {
        return <Navigate to='/signin' />
    }
 
}

export default AuthenticateUser