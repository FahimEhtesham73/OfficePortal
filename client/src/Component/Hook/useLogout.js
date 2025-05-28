import { useNavigate } from "react-router-dom"

const useLogout = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('_info')
        localStorage.removeItem('_token')
        navigate('/signin')
    }

    return { logout }

}

export default useLogout