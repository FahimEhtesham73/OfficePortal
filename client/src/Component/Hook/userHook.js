const userRole =()=>{
    const user = JSON.parse(localStorage.getItem("userData")) 
    const userRole = user.userInformation.role.alias

    return userRole
}

export default userRole