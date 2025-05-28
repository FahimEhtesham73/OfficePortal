import { useNavigate } from "react-router-dom"

const Logout = () => {
    const navigate = useNavigate()
    // const logout = () => {
    //     localStorage.removeItem('_info')
    //     localStorage.removeItem('_token')
    //     navigate('/signin')
    // }

    localStorage.removeItem('_info')
    localStorage.removeItem('_token')
    navigate('/signin')

}

export default Logout