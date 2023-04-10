import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name:"user",
    initialState:{
        name:"",
        role:""
    },
    reducers:{
        addUser(state,action){
            console.log(action.payload);
            state.name = action.payload.userInformation.firstName
            state.role = action.payload.userInformation.role.title
        }
    }
})

export {userSlice}
export const {addUser} = userSlice.actions