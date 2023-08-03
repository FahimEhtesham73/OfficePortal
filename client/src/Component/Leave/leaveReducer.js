export const leaveReducerState = {
    GET_DATA: "getData",
    DELETE_DATA: "deleteData",
    CREATE_LEAVE: "createLeave",
    VIEW_DATA: "viewData",
    UPDATE_DATA: "updateData",
    EMPTYDATA: "emptyData"
} 

export const leaveReducerInitialState = {
    leaves: [],
    singleLeave:{}
}
export function leaveReducer(state, action){
    switch(action.type){
        case leaveReducerState.GET_DATA:{
            return{
                ...state,
                leaves: action.payload
            }
        }
        case leaveReducerState.DELETE_DATA:{
            let updatedLeaves = state.leaves.filter((v,i)=> v._id !== action.payload)
            return{
                ...state,
                leaves: updatedLeaves
                
            }
        }
        case leaveReducerState.UPDATE_DATA: {
            return {
                ...state,
                singleLeave:{
                    ...state.singleLeave,
                }
            }
        }
        case leaveReducerState.VIEW_DATA: {
            return{
                ...state,
                singleLeave: action.payload
            }
        }

        case leaveReducerState.EMPTYDATA: {
            return{
                ...state,
                singleLeave: {}
            }
        }


        

        default:{
            return {...state}
        } 
    }

}