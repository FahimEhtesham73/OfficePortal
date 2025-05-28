import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './UserSlice'
import snapShotSliceReducer  from './SnapshotSlice'

const store = configureStore({
    reducer: {
        users: userSlice.reducer,
        snapshot: snapShotSliceReducer
    }
})

export default store