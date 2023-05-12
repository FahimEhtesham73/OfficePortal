export const getAllProject = async(data, token)=>{
    return await fetch(`${process.env.REACT_APP_URL}/projects/all`,{method: "GET",  headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    //   body: JSON.stringify(data),
      credentials: 'include',})
}