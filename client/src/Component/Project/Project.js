import { Box } from '@mui/material'
import React from 'react'
import SingleProject from './SingleProject'

let arr = [1,2,3,4,5]

const Project = () => {
  return (
    <Box sx={{marginLeft:{sm:'30px',md:"280px"},}}>
      {arr.map((item)=> {
        return(
          <SingleProject />
        )
      })}
    </Box>
  )
}

export default Project