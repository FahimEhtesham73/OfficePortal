import jwtDecode from "jwt-decode"

const userInfo =()=>{
    const token = localStorage.getItem('_info');
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