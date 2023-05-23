import axios from "axios"
export const getAllRoles = async (token) => {
    return await axios.get(`${process.env.REACT_APP_URL}/roles/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,

        }
    })


}