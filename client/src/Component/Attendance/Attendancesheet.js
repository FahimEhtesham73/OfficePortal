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

import FileDownloadIcon from '@mui/icons-material/FileDownload';



import Cookies from 'js-cookie';
import { Grid, TextField } from '@mui/material';
import dayjs from 'dayjs';


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
    // '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.action.hover,
    // },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Attendancesheet = () => {
    const jwt = localStorage.getItem('_token')
    const date = new Date()
    // const year = date.getFullYear()
    // const month = date.getMonth() + 1
    const [month, setMonth] = useState(date.getMonth() + 1)
    const [year, setYear] = useState(date.getFullYear())
    const [searchingDate, setSearchinDate] = useState('')
    const [attendanceData, setAttendanceData] = useState('')
    const [loading, setLoading] = useState(false)
    const [empName, setEmpName] = useState("")
    const [allData, setAllData] = useState([])

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
        // console.log("attendence date", data);
        if (res.status === 200) {
            setAttendanceData(data)
            setAllData(data)
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
        targetTime.setHours(9);
        targetTime.setMinutes(0);
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
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    function filterAttendenceData(text) {
        if (text.length <= 0) {
            setAttendanceData(allData)
            return;
        }
        let re = new RegExp(`${text}`, "i")
        const filterData = allData?.filter((d, i) => re.test(d?.user));
        // console.log(filterData);
        setAttendanceData(filterData)
    }

    const generateExcelData = (data) => {
        // console.log({data});
        const monthHeader = ['Month', date.toLocaleString('default', {
            month: 'long'
        })]
        const header = data.length < 1 ? [] : ["User", ...data[0].attendance.map((day) => `Day ${day.day}/ ${getWeekdayName(new Date(`${year}/${month}/${day.day}`))}`)];
        const rows = data.map((user) => {
            const userRow = [user.user];
            user.attendance.forEach((day) => {
                if (day.present) {
                    const aIdString = day.aId.length > 0 ? day.aId.join("<br>") : "";
                    const checkInTime = (day.modifiedCheckIn === "" || day.modifiedCheckIn === "Unspecified") ? formatAMPM(new Date(day.checkIn)) : formatAMPM(new Date(day.modifiedCheckIn))
                    userRow.push(`Present<br>${aIdString}<br>${checkInTime}`);
                } else {
                    userRow.push("Absent");
                }
            });
            return userRow;
        });
        // console.log("rows", rows);
        return [header, ...rows];
    }

    const getWeekdayName = (date) => {
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return weekdays[date.getDay()];
    };
    // console.log({attendanceData});

    const handleDownload = () => {
        const data = generateExcelData(attendanceData);

        let worksheet = "<table>";
        worksheet += "<tr>"
        worksheet += `<td>Month</td>`;
        worksheet += `<td>${searchingDate ? searchingDate.toLocaleString('default', {
            month: 'long'
        }) : new Date().toLocaleString('default', {
            month: 'long'
        })}</td>`;
        worksheet += "</tr>";
        data.forEach((row) => {
            worksheet += "<tr>";
            row.forEach((cell) => {
                worksheet += `<td>${cell}</td>`;
            });
            worksheet += "</tr>";
        });
        worksheet += "</table>";

        const excelData =
            "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8," +
            encodeURIComponent(
                `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
               <head>
                   <!--[if gte mso 9]>
                   <xml>
                       <x:ExcelWorkbook>
                           <x:ExcelWorksheets>
                               <x:ExcelWorksheet>
                                   <x:Name>Attendance</x:Name>
                                   <x:WorksheetOptions>
                                       <x:DisplayGridlines/>
                                   </x:WorksheetOptions>
                               </x:ExcelWorksheet>
                           </x:ExcelWorksheets>
                       </x:ExcelWorkbook>
                   </xml>
                   <![endif]-->
               </head>
               <body>
                   ${worksheet}
               </body>
           </html>`
            );

        const anchor = document.createElement("a");
        anchor.href = excelData;
        anchor.download = `attendance_${year}_${month}.xls`;
        anchor.click();
    };

    useLayoutEffect(() => {
        getAttendanceSheet()
    }, [])

    return (
        <>
            {
                loading ? <> <Loading /> </> :
                    <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px", maxWidth: '2618px' }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Attendance</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "25px" }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Filter By Date</Typography>
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "20px", flexDirection: "column" }}>
                            <Box sx={{ display: "flex", flexFlow: { xs: "column", lg: "row" }, justifyContent: "start", alignItems: "start" }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
                                        <DatePicker sx={{ maxWidth: 365, width: 365 }} label={'Select Date'}
                                            value={dayjs(searchingDate)}
                                            slotProps={{ textField: { error: false } }}
                                            placeHolder='MM YYYY'
                                            views={['year', 'month']} onChange={(e) => {

                                                if (e?.['$d']) {

                                                    if (e.$y === year && e.$M + 1 === month) {
                                                        setSearchinDate('')
                                                    } else {
                                                        setSearchinDate(e.$d)
                                                        setMonth(e.$M + 1)
                                                        setYear(e.$y)
                                                    }
                                                }
                                            }} />
                                    </DemoContainer>
                                </LocalizationProvider>
                                {/* <Typography></Typography> */}

                                <Button variant="contained" sx={{ minWidth: 365, height: 55, margin: { md: "0", lg: "10px 20px 40px 20px" }, marginTop: { xs: "10px", md: "10px" } }} onClick={getAttendanceSheet}>Search</Button>

                            </Box>


                            {/* Employee Filter */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "0px" }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Filter By Name</Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexFlow: { xs: "column", lg: "row" }, justifyContent: "start", alignItems: "start" }}>

                                <TextField id="outlined-search" label="Employee Name" value={empName} type="search" sx={{ maxWidth: 365, width: 365, height: 55, margin: { md: "0", lg: "10px 20px 0px 0px" } }}
                                    onChange={(e) => {
                                        setEmpName(e.target.value)
                                        filterAttendenceData(e.target.value)
                                    }
                                    }
                                    name='empName' />
                            </Box>


                            <Grid container xs={12} sm={12} md={12}>
                                <Box sx={{ marginTop: { xs: "40px" }, display: "flex", justifyContent: "end" }}>
                                    <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ width: 200, height: 55, }} onClick={handleDownload}>
                                        Download Attendance
                                    </Button>
                                </Box>
                                <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", width: "82vw", height: "100vh", overflowY: "scroll" }}>
                                    <Table sx={{ minWidth: 650, height: "auto", overflowY: "scroll" }} aria-label="simple table">
                                        <TableHead sx={{ position: "sticky", top: 0, zIndex: 2 }}>
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
                                        <TableBody >
                                            {
                                                attendanceData && attendanceData.map((row, ind) => (
                                                    <StyledTableRow
                                                        key={row.user}
                                                    >
                                                        <StyledTableCell component="th" scope="row"
                                                            sx={{ position: "sticky", left: 0, padding: "0 10px", zIndex: 1, background: "#fff" }}>
                                                            {row.user}
                                                        </StyledTableCell>
                                                        {
                                                            row?.attendance.map((val) => {
                                                                return (

                                                                    <StyledTableCell  >{val.present === true ? (
                                                                        <>
                                                                            <CheckIcon style={{ color: 'green' }} />
                                                                            {
                                                                                val?.aId && val.aId.map(aStatus => {
                                                                                    var color = {}
                                                                                    switch (aStatus) {
                                                                                        case 'HD':
                                                                                            color['color'] = 'orange'
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
                                                                            {val?.checkIn && isCheckLateTime(val?.modifiedCheckIn !== 'Unspecified' ? val?.modifiedCheckIn : val?.checkIn) ? <InfoIcon titleAccess={formatAMPM(new Date(val?.modifiedCheckIn !== 'Unspecified' ? val?.modifiedCheckIn : val?.checkIn))} /> : ""}
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
                            </Grid>

                        </Box>
                    </Box>
            }
        </>

    )
}

export default Attendancesheet