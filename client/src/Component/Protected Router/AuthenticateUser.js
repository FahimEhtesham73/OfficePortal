import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const AuthenticateUser = ({children}) => {
    let cookies = localStorage.getItem('_info')
    // console.log({cookies});
    if(cookies){
        return children
    }
    else {
        return <Navigate to='/signin' />
    }
 
}

export default AuthenticateUser