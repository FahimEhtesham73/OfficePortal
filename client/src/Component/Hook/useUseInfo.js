import Cookies from "js-cookie"
import jwtDecode from "jwt-decode"
const userInfo =()=>{
    const token = Cookies.get('_info');
    var decoded
    if(token){
        decoded = jwtDecode(token);
    }else{
        decoded = ''
    }

    const userInfo = decoded

    return userInfo
}

export default userInfo;