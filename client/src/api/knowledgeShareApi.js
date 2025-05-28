import axios from "axios"
export const getAllKnowledge = async (data, token) => {
    return await axios.post(`${process.env.REACT_APP_URL}/knowledge/filter`, data, {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        
    }})

}
export const getSingleKnowledge = async (data, token) => {
    return await axios.get(`${process.env.REACT_APP_URL}/knowledge/knowledge/${data}`, {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        
    }})

}

export const getAllCategory = async (token) => {
    return await axios.get(`${process.env.REACT_APP_URL}/knowledge/category`,{headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
    }})

}

export const craeteCategory = async (token, data) => {
    return await axios.post(`${process.env.REACT_APP_URL}/knowledge/category`, data, {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
    }})

}

export const fileUpload = async (token, data) => {
    return await axios.post(`${process.env.REACT_APP_URL}/knowledge/fileupload`, data, {headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + token,

    }})

}

export const createKnowledge = async (token, data) => {
    return await axios.post(`${process.env.REACT_APP_URL}/knowledge/createvideoblog`, data, {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,

    }})

}

export const deleteFileFromLocaFilesytem = async (token, data) => {
    return await axios.post(`${process.env.REACT_APP_URL}/knowledge/deleteFile`, data, {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,

    }})

}

export const deleteSingleKnowledgeApi = async (token, data) => {
    return await axios.delete(`${process.env.REACT_APP_URL}/knowledge/knowledge/${data}`, {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,

    }})

}
export const updateSingleKnowledgeShare = async (token, data) => {
    return await axios.put(`${process.env.REACT_APP_URL}/knowledge/knowledge/${data.id}`,data, {headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,

    }})

}

export const downloadFile = async (token, data) => {
    return await axios.get(`${process.env.REACT_APP_URL}/knowledge/downloadfile/${data}`,{
        responseType: "blob",
        })

}