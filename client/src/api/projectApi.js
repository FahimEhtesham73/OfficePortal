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

export const getAllTaskApi = async(data, token)=> {
  return await fetch(`${process.env.REACT_APP_URL}/task?pid=${data}`,{method: "GET",  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  credentials: 'include',})
}

export const createProjectTaskApi = async(data, token)=> {
  return await fetch(`${process.env.REACT_APP_URL}/task/create`,{method: "POST",  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify(data),

  credentials: 'include',})
}

export const updateATaskApi = async(data, token)=> {
  return await fetch(`${process.env.REACT_APP_URL}/task/update`,{method: "POST",  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify(data),

  credentials: 'include',})
}


export const getSingleTaskApi = async(data, token)=> {
  return await fetch(`${process.env.REACT_APP_URL}/task/get-task?pcd=${data.projectCode}&taskId=${data.taskId}`,{method: "GET",  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },

  credentials: 'include',})
}

export const deleteSingleTaskApi = async(data, token)=> {
  return await fetch(`${process.env.REACT_APP_URL}/task/deletetask?pcd=${data.projectCode}&taskId=${data.taskId}`,{method: "DELETE",  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  credentials: 'include',})
}

export const filterProjectTask = async(data, token)=> {
  return await fetch(`${process.env.REACT_APP_URL}/task/filter`,{method: "POST",  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify(data),
  credentials: 'include',})
}

export const taskSummaryApi = async(projectCode,query,token)=> {
  return await fetch(`${process.env.REACT_APP_URL}/task/summary?projectCode=${projectCode}`,{method: "POST",  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({query: query}),
  credentials: 'include',})
}
