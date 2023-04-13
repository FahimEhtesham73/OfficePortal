import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const AuthenticateUser = ({children}) => {
    let cookies = Cookies.get('_info')

    if(cookies){
        return children
    }
    else {
        return <Navigate to='/signin' />
    }
 
}

export default AuthenticateUser