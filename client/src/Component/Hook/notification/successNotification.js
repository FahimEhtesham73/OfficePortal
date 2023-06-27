import React from 'react'
import { toast } from 'react-toastify'

const useSuccessNotifcation = ({msg}) => {
    
    if(msg){
       return toast.success(msg, {
        position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
       })
    }else{
        return toast.success("Successfull", {
            position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    pauseOnHover: false,
           })
    }
 
}

export default useSuccessNotifcation;