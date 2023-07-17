import axios from "axios"
export const getAllHoildaysApi = async (token) => {
    return await axios.get(`${process.env.REACT_APP_URL}/holiday/getallholiday`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,

        }
    })


}