import React from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,{ tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: 'white',
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const Attendancesheet = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    // Finding total number of days in this current Month
    function daysInMonth(month, year) {
        const totalDay = new Date(year, month, 0).getDate();
        return Array.from({ length: (totalDay - 1) / 1 + 1 },
            (value, index) => 1 + index * 1)
    }

    const rows = [
        { name: "Saimom", 1: "Yes", 2: "Yes", 3: "No", 4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" },
        { name: "Shuvo", 1: "Yes", 2: "Yes", 3: "No", 4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" },
        { name: "Badhon", 1: "Yes", 2: "Yes", 3: "No", 4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" },
        { name: "Mredul", 1: "Yes", 2: "Yes", 3: "No", 4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" },
        { name: "Nahid", 1: "Yes", 2: "Yes", 3: "No", 4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" },
        { name: "Saiful", 1: "Yes", 2: "Yes", 3: "No",4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" },
        { name: "Ibrahim", 1: "Yes", 2: "Yes", 3: "No",  4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" },
        { name: "Abir", 1: "Yes", 2: "Yes", 3: "No", 4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" },
        { name: "Arafath", 1: "Yes", 2: "Yes", 3: "No",4: "Yes", 5: "No", 6: "Yes", 7: "Yes", 8: "No", 9: "Yes", 10: "Yes", 11: "No", 12: "Yes", 13: "Yes", 14: "No", 15: "Yes", 16: "Yes", 17: "No", 18: "Yes", 19: "Yes", 20: "No", 21: "Yes", 22: "Yes", 23: "No", 24: "Yes", 25: "Yes", 26: "No", 27: "Yes", 28: "Yes", 29: "No", 30: "Yes", 31: "No" }
    ]

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Attendance</Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap",  marginTop: "40px" }}>
                
                <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }}>
                    <InputLabel id="demo-simple-select-label">Select Month</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Select Month"
                    // onChange={handleChange}
                    >
                        <MenuItem value={10}>January</MenuItem>
                        <MenuItem value={20}>February</MenuItem>
                        <MenuItem value={30}>March</MenuItem>
                        <MenuItem value={10}>April</MenuItem>
                        <MenuItem value={20}>May</MenuItem>
                        <MenuItem value={30}>June</MenuItem>
                        <MenuItem value={10}>July</MenuItem>
                        <MenuItem value={20}>August</MenuItem>
                        <MenuItem value={30}>September</MenuItem>
                        <MenuItem value={10}>October</MenuItem>
                        <MenuItem value={20}>November</MenuItem>
                        <MenuItem value={30}>December</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }}>
                    <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Select year"
                    // onChange={handleChange}
                    >
                        <MenuItem value={10}>2021</MenuItem>
                        <MenuItem value={20}>2022</MenuItem>
                        <MenuItem value={30}>2023</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }}>Search</Button>
                <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", minWidth: '600px', width: "82vw" }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{fontWeight:"bold"}}>Employee</StyledTableCell>
                                {
                                    daysInMonth(month, year).map(val => {
                                        return (
                                            <StyledTableCell sx={{fontWeight:"bold"}}>{val}</StyledTableCell>
                                        )

                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, ind) => (
                                <StyledTableRow
                                    key={row.name}
                                >
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    {
                                        Object.keys(rows[ind]).map((val, index) => {
                                            if (val !== 'name') {
                                                return (
                                                    <StyledTableCell align="right">{row[val] === 'Yes' ? <CheckIcon style={{color:'green'}}/> : <CloseIcon style={{color:'red'}}/>}</StyledTableCell>
                                                )
                                            }
                                        })
                                    }
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>

    )
}

export default Attendancesheet