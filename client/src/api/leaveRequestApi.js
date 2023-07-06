export const createLeaveApi = async(data, token)=>{
    return await fetch(`${process.env.REACT_APP_URL}/leave/createleavereqemptl`,{method: "POST",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data),
      credentials: 'include',})
  }

  export const createLeaveApiForSup = async(data, token)=>{
    return await fetch(`${process.env.REACT_APP_URL}/leave/createleavereqsvadmin`,{method: "POST",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data),
      credentials: 'include',})
  }

  export const createLeaveBoardApi = async(data, token)=>{
    return await fetch(`${process.env.REACT_APP_URL}/leave/userleaves`,{method: "POST",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data),
      credentials: 'include',})
  }

  export const getUserLeaveBoardApi = async(data, token)=>{
    return await fetch(`${process.env.REACT_APP_URL}/leave/userleaves?userId=${data}`,{method: "GET",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      credentials: 'include',})
  }

// get leave api
export const getLeaveApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/leave/get-user-leave`,{method: "POST",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data),
    credentials: 'include',})
}

//delete a leave
export const deleteALeaveApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/leave/deletealeave?leaveId=${data}`,{method: "DELETE",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    credentials: 'include',})
}

//get leave for team lead and supervison
export const getLeaveStatusApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/leave/getleavestatus?userId=${data.userId}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`,{method: "GET",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    credentials: 'include',})
}

// get leave api
export const updateALeaveAPI = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/leave/update`,{method: "POST",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data),
    credentials: 'include',})
}

export const updateALeaveStatusAPI = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/leave/leavestatusupdate`,{method: "POST",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data),
    credentials: 'include',})
}


export const leaveSummeryApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/leave/leavesummary`,{method: "POST",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data),
    credentials: 'include',})
}

export const searchLeaveApi = async(data, token)=>{
  return await fetch(`${process.env.REACT_APP_URL}/leave/filterleave?selfId=${data.selfId}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`,{method: "POST",  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data.search),
    credentials: 'include',})
}


