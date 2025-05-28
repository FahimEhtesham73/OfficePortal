import axios from "axios"
export const getAllDesignations = async (data, token) => {
    return await axios.get(`${process.env.REACT_APP_URL}/designations/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })


}