import React, { useEffect, useLayoutEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

import Loading from '../Hook/Loading/Loading';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';

import Cookies from 'js-cookie';


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
    const jwt = Cookies.get('_token')
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const [searchingDate, setSearchinDate] = useState('')
    const [attendanceData, setAttendanceData] = useState('')
    const [loading, setLoading] = useState(false)

    // Finding total number of days in this current Month
    function daysInMonth(month, year) {
        const totalDay = new Date(year, month, 0).getDate();
        return Array.from({ length: (totalDay - 1) / 1 + 1 },
            (value, index) => 1 + index * 1)
    }

    console.log("Attendence Data", attendanceData);

    const getAttendanceSheet = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/alluseratendance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({ searchingDate }),
        })

        const data = await res.json()
        console.log("attendence date", data);
        if (res.status === 200) {
            setAttendanceData(data)
            setLoading(false)
        }
        else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            setLoading(false)
        }
    }

    const isCheckLateTime = (date) => {
        const givenDate = new Date(date);

        // Create a new date object with the desired time (8:30 AM)
        const targetTime = new Date();
        targetTime.setHours(8);
        targetTime.setMinutes(30);
        targetTime.setSeconds(0);
        targetTime.setMilliseconds(0);

        // Compare the hours and minutes of the given date with the target time
        if (givenDate.getHours() > targetTime.getHours() || (givenDate.getHours() === targetTime.getHours() && givenDate.getMinutes() > targetTime.getMinutes())) {
            return true
        } else {
            return false
        }
    }
    // Convert Date
    function formatAMPM(date) {
        console.log("Date",date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    useLayoutEffect(() => {
        getAttendanceSheet()
    }, [])

    return (
        <>
            {
                loading ? <> <Loading /> </> :
                    <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Attendance</Typography>
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px" }}>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
                                    <DatePicker label={'Select Date'} views={['month', 'year']} onChange={(e) => {
                                        console.log(e);
                                        if (e.$y === year && e.$M + 1 === month) {
                                            setSearchinDate('')
                                        } else {
                                            setSearchinDate(e.$d)
                                        }
                                    }} />
                                </DemoContainer>
                            </LocalizationProvider>
                            <Button variant="contained" sx={{ minWidth: 365, height: 55, margin: "10px 20px 40px 20px" }} onClick={getAttendanceSheet}>Search</Button>
                            <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", minWidth: '600px', width: "82vw" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell sx={{ fontWeight: "bold" }}>Employee</StyledTableCell>
                                            {
                                                daysInMonth(month, year).map(val => {
                                                    return (
                                                        <StyledTableCell sx={{ fontWeight: "bold" }}>{val}</StyledTableCell>
                                                    )

                                                })
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            attendanceData && attendanceData.map((row, ind) => (
                                                <StyledTableRow
                                                    key={row.user}
                                                >
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.user}
                                                    </StyledTableCell>
                                                    {
                                                        row?.attendance.map((val) => {
                                                            return (

                                                                <StyledTableCell>{val.present === true ? (
                                                                    <>
                                                                        <CheckIcon style={{ color: 'green' }} />
                                                                        {
                                                                            val?.aId && val.aId.map(aStatus => {
                                                                                var color = {}
                                                                                switch (aStatus) {
                                                                                    case 'HD':
                                                                                        color['color'] = '#b1b148'
                                                                                        break;
                                                                                    case 'WAO':
                                                                                        color['color'] = 'black'
                                                                                        break;
                                                                                    case 'WOH':
                                                                                        color['color'] = 'blue'
                                                                                        break;
                                                                                    case 'WFH':
                                                                                        color['color'] = '#ff1105b8'
                                                                                        break;
                                                                                    default:
                                                                                        color['color'] = 'black'
                                                                                }
                                                                                return (
                                                                                    <p style={color}>{aStatus}</p>
                                                                                )
                                                                            })


                                                                        }
                                                                        {val?.checkIn && isCheckLateTime(val.checkIn) ? <InfoIcon titleAccess={formatAMPM(new Date(val?.checkIn))} /> : ""}
                                                                    </>
                                                                )
                                                                    : <CloseIcon style={{ color: 'red' }} />}</StyledTableCell>
                                                            )
                                                        })
                                                    }
                                                </StyledTableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
            }
        </>

    )
}

export default Attendancesheet