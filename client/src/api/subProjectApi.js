export const getAllSubProject = async(data, token,id)=>{
    return await fetch(`${process.env.REACT_APP_URL}/subproject/all/${id}`,{method: "GET",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    //   body: JSON.stringify(data),
      credentials: 'include',})
}

export const createASubProjectApi = async(data, token,id)=>{
    // console.log("subproject data body",data);
    return await fetch(`${process.env.REACT_APP_URL}/subproject/create/${id}`,{method: "POST",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data),
      credentials: 'include',})
  }

  export const deleteSubProjectApi = async(data, token)=>{
    return await fetch(`${process.env.REACT_APP_URL}/subproject/delete`,{method: "DELETE",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data),
      credentials: 'include',})
  }

  export const getASubprojectApi = async(data, token)=>{
    return await fetch(`${process.env.REACT_APP_URL}/subproject/id/${data}`,{method: "GET",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      // body: JSON.stringify(data),
      credentials: 'include',})
  }

  export const updateSubProjectApi = async(data, token,id,subid)=>{
    return await fetch(`${process.env.REACT_APP_URL}/subproject/update/${id}/${subid}`,{method: "PUT",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data),
      credentials: 'include',})
  }

