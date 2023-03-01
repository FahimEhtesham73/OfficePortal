import React, { useReducer, createContext } from 'react'
import App from '../App'
import {reducer} from '../reducer/reducer'

export const AllContext = createContext()

let initialState = {
    value: 0
}

const MainContext = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const Add = ()=>{
        return dispatch({
            type:"ADD"
        })
    }
    const Minus = ()=>{
        return dispatch({
            type:"Minus"
        })
    }
  return (
    <AllContext.Provider value={{...state, Add, Minus}}>
        <App />
    </AllContext.Provider>
  )
}

export default MainContext