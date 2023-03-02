import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
        { name: "saimom", 1: "Yes", 2: "Yes", 3: "No" },
        { name: "saimom", 1: "Yes", 2: "Yes", 3: "No" },
        { name: "saimom", 1: "Yes", 2: "Yes", 3: "No" },
        { name: "saimom", 1: "Yes", 2: "Yes", 3: "No" },
        { name: "saimom", 1: "Yes", 2: "Yes", 3: "No" },
        { name: "saimom", 1: "Yes", 2: "Yes", 3: "No" }
    ]


    return (
        <TableContainer component={Paper} sx={{ marginTop: "50px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell >Employee</TableCell>
                        {
                            daysInMonth(month, year).map(val => {
                                return (
                                    <TableCell >{val}</TableCell>
                                )

                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row,ind) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            {
                                Object.keys(rows[ind]).map((val,index) => {
                                    if (val !== 'name') {
                                        return (
                                            <TableCell align="right">{row[val]}</TableCell>
                                        )
                                    }
                                })
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Attendancesheet