import axios from "axios"
export const modifySingleAttendene = async (data, token) => {
    return await axios.post(`${process.env.REACT_APP_URL}/attendence/modify`, data, {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        
    }})

}