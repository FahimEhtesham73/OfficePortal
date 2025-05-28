import Cookies from "js-cookie"
import jwtDecode from "jwt-decode"
const userRole =()=>{
    const token = localStorage.getItem('_info')
    var decoded 
    if(token){
        decoded = jwtDecode(token);
    }else{
        decoded = ''
    }

    const userRole = decoded?.role.alias

    return userRole
}

export default userRole