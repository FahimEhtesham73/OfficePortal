import {configureStore} from '@reduxjs/toolkit'
import { userSlice } from './UserSlice'

const store = configureStore({
    reducer:{
        users:userSlice.reducer
    }
})

export default store