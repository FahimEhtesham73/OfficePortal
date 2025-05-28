import React from 'react'
import { Navigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';
const AdminCombinedProtected = ({ children }) => {
    const token = localStorage.getItem('_info')
    var decoded 
    if(token){
        decoded = jwt_decode(token);
    }else{
        decoded = ''
        return <Navigate to='/signin' />
    }

    if (decoded?.role?.alias === 'Admin' || decoded?.role?.alias === 'Team Lead' || decoded?.role?.alias === 'Project Lead') {
        return children
    }
    else {
        return <Navigate to='/' />
    }

}

export default AdminCombinedProtected