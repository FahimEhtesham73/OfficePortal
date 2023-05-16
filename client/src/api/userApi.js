import axios from "axios"
export const fileUpload = async(data, token)=>{
    return await axios.post(`${process.env.REACT_APP_URL}/users/fileupload`, data,  {headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": "Bearer " + token,
                            
                        }})
      

    
}

export const getCvApi = async (data, token) => {
    return await fetch(`${process.env.REACT_APP_URL}/users/viewcv`,{method: "POST",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data),
      credentials: 'include',})
}

export const getSingleUser = async(data, token)=> {
    return await axios.get(`${process.env.REACT_APP_URL}/users/getsingleuser/${data}`,  {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        
    }})


}