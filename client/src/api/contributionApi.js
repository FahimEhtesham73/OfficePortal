import axios from "axios"
export const getProjectContributionSingleDay = async (data, token) => {
    return await axios.post(`${process.env.REACT_APP_URL}/contribution/getSingleDayContribution`,data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })
}

export const createProjectContribution = async (data, token) => {
    return await axios.post(`${process.env.REACT_APP_URL}/contribution/createContribution`,data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })
}

export const deleteProjectContribution = async (data, token) => {
    return await axios.post(`${process.env.REACT_APP_URL}/contribution/deleteSingleDayContribution`,data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })
}