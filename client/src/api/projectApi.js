export const getAllProject = async(data, token)=>{
    return await fetch(`${process.env.REACT_APP_URL}/projects/all`,{method: "GET",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    //   body: JSON.stringify(data),
      credentials: 'include',})
}

export const createAProjectApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/projects/create`,{method: "POST",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data),
    credentials: 'include',})
}

export const getAprojectApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/projects/${data}`,{method: "GET",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    // body: JSON.stringify(data),
    credentials: 'include',})
}

export const updateProjectApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/projects/update`,{method: "PUT",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data),
    credentials: 'include',})
}

export const deleteProjectApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/projects/delete`,{method: "DELETE",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data),
    credentials: 'include',})
}