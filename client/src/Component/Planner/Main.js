import React from 'react'

import ProjectChart from './ProjectChart'
import DetailsTable from './DetailsTable'
import { Box } from '@mui/material'

export default function Main() {
  return (
    <Box sx={{ marginLeft: { sm: '20px', md: "280px", xs: '20px' }, marginRight: "10px" }}>
      <DetailsTable />
    </Box>
  )
}
