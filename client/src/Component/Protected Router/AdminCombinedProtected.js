import React from 'react'
import { Navigate } from 'react-router-dom'

const AdminCombinedProtected = ({children}) => {
    const user = JSON.parse(localStorage.getItem("userData")) 

    if(user?.userInformation?.role?.alias==='Admin' || user?.userInformation?.role?.alias==='Team Lead'){
        return children
    }
    else {
        return <Navigate to='/' />
    }
 
}

export default AdminCombinedProtected