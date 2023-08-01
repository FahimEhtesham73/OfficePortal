import React, { useEffect, useState } from 'react'
import { PieChart } from './PieChart'
import { taskSummaryApi } from '../../api/projectApi'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'
import { Box, Card, Grid, Typography } from '@mui/material'


const TaskSummary = ({data, othersData}) => {




  // const fetchSummary = async () => {
  //   const response = await taskSummaryApi(id, query, jwt);
  //   if (response.status === 200) {
  //     const responseData = await response.json();
  //     console.log(responseData.data[0]);
  //     setData(Object.values(responseData.data[0].summary))
  //     setOthersData({
  //       ...othersData, 
  //       totalData: responseData.data[0].totalTasks,
  //       totalTodaysDeadline: responseData.data[0].totalDeadelineToday
  //     })
  //   }
  // }
  // useEffect(() => {
  //   fetchSummary()
  // }, [id])
  return (
    <div>
      <h2>Task Summary</h2>

      <Box sx={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: {xs: "column", lg: 'row'}
      }}>
        <Box sx={{display: "flex", flexDirection: "column",gap: "1rem", padding: "1rem 0"}} >
          <Card elevation='4' sx={{ maxHeight: 345, padding: ".5rem 1rem", backgroundColor: "#6ae891" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Total Task</Typography>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{othersData?.totalData ||  0}</Typography>
            </Box>
          </Card>
          <Card elevation='4' sx={{ maxHeight: 345, padding: ".5rem 1rem", backgroundColor: "#fc7746" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: "" }}>Deadline Today</Typography>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{othersData?.totalTodaysDeadline}</Typography>
            </Box>
          </Card>
        </Box>

        <div>
          <PieChart sdata={data} />
        </div>
      </Box>


    </div>
  )
}

export default TaskSummary