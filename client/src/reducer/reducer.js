export const reducer =(state,action) => {
    
    switch(action.type){
        case 'ADD':
            // state.value = state.value + 1
            return {...state, value:state.value + 1 }
        case 'Minus':
            // state.value = state.value - 1
            return {...state, value:state.value - 1 }
        default:
            return {...state}
    }
}