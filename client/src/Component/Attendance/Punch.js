import { Box, Button, Card, CardContent, Paper, ToggleButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Tooltip, makeStyles } from '@material-ui/core';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import userRole from '../Hook/userHook';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import CheckIcon from '@mui/icons-material/Check';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { modifySingleAttendene } from '../../api/attendenceApi';

const useStyles = makeStyles((theme) => ({
    cardWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "60px",
        width: "100%",
        flexWrap: 'wrap'
    },
    timeColor: {
        color: '#8E8E8E'
    },
    paperDesign: {
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#8E8E8E",
        borderRadius: "10px"
    },
    circleWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "30px"
    },
    circle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        border: `8px solid #8E8E8E`,
    },
    button: {
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
    }
}))
// table cell styling
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};


const Punch = () => {
    const jwt = Cookies.get('_token')
    const jwtUser = Cookies.get('_info')
    var decoded
    var decodedUser
    if (jwt) {
        decoded = jwtDecode(jwt);
    } else {
        decoded = ''
    }

    if (jwtUser) {
        decodedUser = jwtDecode(jwtUser);
    } else {
        decodedUser = ''
    }

    const classes = useStyles()

    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState([])
    const [checkBoxDisableHome, setCheckBoxDisableHome] = useState(false)
    const [checkBoxDisableOffice, setCheckBoxDisableOffice] = useState(false)
    const [isPunchedIn, setIsPunchedIn] = useState(false)
    const [punchedTime, setPunchedTime] = useState("")
    const [punchedInfo, setPunchedInfo] = useState('')
    const [attendenceList, setAttendenceList] = useState([])
    const [allUser, setAllUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [filteredId, setFilteredId] = useState("")
    const [filteredDate, setFilteredDate] = useState('')
    const [totalWH, setTotalWH] = useState();
    const [editingrow, setEditingrow] = useState(false);
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [updateAttendence, setUpdateAttendence] = useState({});
    const [checkBoxHD, setCheckBoxHD] = useState(false)
    const [checkBoxWOH, setCheckBoxWOH] = useState(false)
    
    const [punchoutUpdate, setPunchutUpdate] = useState(false);
    const [endtimeChange, setEndDateTimeChanged] = useState(false);

    
    // For Modal open
    // console.log("position", updateAttendence);

    const [open1, setOpen1] = useState(false)
    const handleClickOpen = () => {
        setOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setOpen(false);
    };


    const handleModalOpen1 = () => {
        setOpen1(true);
    };



    // For Modal Close
    const handleModalClose1 = () => {
        setOpen1(false);
        setUpdateAttendence({});
        setPosition([])
        setCheckBoxDisableHome(false);
        setCheckBoxDisableOffice(false);
        setEndDateTimeChanged(false);
        setPunchutUpdate(false)
        setCheckBoxWOH(false)
        setCheckBoxHD(false)
        
    };

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

    function formatDateMonth() {
        const date = new Date()
        const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        return formattedDate
    }

    const handlePosition = (e) => {
        console.log("hadnle position", e.target.value);
        if (e.target.value === 'WFH') {
            if (position?.includes('WFH')) {
                setCheckBoxDisableHome(false)
                const temp = position?.filter((val) => { return val !== 'WFH' }) 
                setPosition(temp)
            } else {
                setCheckBoxDisableHome(true)
                setCheckBoxDisableOffice(false)
                const unchekedFilter = position?.filter((val) => { return val !== 'WAO' })
                setPosition([...unchekedFilter, 'WFH'])
            }

        }
        else if (e.target.value === 'WAO') {
            if (position?.includes('WAO')) {
                setCheckBoxDisableOffice(false)
                const temp = position?.filter((val) => { return val !== 'WAO' })
                setPosition(temp)
            } else {
                setCheckBoxDisableOffice(true)
                setCheckBoxDisableHome(false)
                const unchekedFilter = position?.filter((val) => { return val !== 'WFH' })
                setPosition([...unchekedFilter, 'WAO'])
            }

        } else {
            if (position?.includes(e.target.value)) {
                const unchekedFilter = position?.filter((val) => { return e.target.value !== val })
                setPosition(unchekedFilter)
            } else {
                if(e.target.value !== undefined){
                    setPosition([...position, e.target.value])
                }
                
            }

        }
    }
// console.log("position",position);

    const handleUpateSingleAttendece = (row) => {
        handleModalOpen1()
        let a = row
        // console.log("Row Information", a);
        setUpdateAttendence({ ...a });
        setStartDateTime(a?.modifiedCheckInTime ? a?.modifiedCheckInTime : a.checkInTime || a?.key)
        setEndDateTime(a?.modifiedCheckOutTime? a?.modifiedCheckOutTime: a.checkOutTime ||  a?.key)
        if(a?.checkOutTime || a?.modifiedCheckOutTime) {setPunchutUpdate(true); setEndDateTimeChanged(true)}
        setPosition(a?.status || [])

        // console.log("postion", position);
        // setPosition(a?.status);
         if(a?.status?.includes('WAO')){
             setCheckBoxDisableOffice(true);
             setCheckBoxDisableHome(false)
             setPosition([...a?.status])

         }
         else if(a?.status?.includes('WFH')){                                                  
             setCheckBoxDisableHome(true)
             setCheckBoxDisableOffice(false)
            //  setPosition([...a?.status])
         }
        if(a?.status?.includes("HD")){
            setCheckBoxHD(true)
         }
         if(a?.status?.includes("WOH")){
            setCheckBoxWOH(true)
         }
    }

    const punchIn = async () => {
        if (position.length === 0) {
            toast.warning("Select Your Work Position", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        } else {
            const filteredArr = position.filter((val) => { return val !== undefined })

            setPosition(filteredArr)
            const res = await fetch(`${process.env.REACT_APP_URL}/attendence/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt
                },
                body: JSON.stringify({
                    checkInTime: new Date(),
                    status: filteredArr
                }),
                credentials: 'include',
                withCredentials: true
            })

            const data = await res.json()
            if (res.status === 200 || res.status === 201) {
                // console.log("created punch data", data);
                toast.success("Punched In Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                // localStorage.setItem('punchedInTime', data?.info?.checkInTime)
                const localTime = formatAMPM(new Date(data?.info?.checkInTime))
                setPunchedTime(localTime)
                setIsPunchedIn(true)
                document.getElementById("time").innerText = `00:00`
                setPosition([])
                getInfo()
                getPunchedInfo()
            } else {
                toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            }
        }

    }

    const punchOut = async () => {
        // console.log("Attendance ID", decoded?._id);
        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({
                aId: punchedInfo._id,
                userId: decoded?._id,
                updateData: {
                    checkOutTime: new Date()
                }
            }),
            credentials: 'include',
            withCredentials: true
        })
        const data = await res.json()
        // console.log("Punched Out",data);
        if (res.status === 200) {
            // localStorage.removeItem('punchedInTime')
            setIsPunchedIn(false)
            const localTime = formatAMPM(new Date(data.data.checkOutTime))
            document.getElementById("time").innerText = ''
            toast.success(`You Punched Out At ${localTime}`, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            getInfo()
        }
    }
    // console.log(updateAttendence);
    const updateUserAttendence = async () => {
        try {

            const data = {
                aId: updateAttendence?._id || "",
                userId: updateAttendence?.userId,
                checkInTime: updateAttendence?.checkInTime || "",
                checkOutTime: updateAttendence?.checkOutTime || "",
                status: position?.length && position,
                modifiedCheckInTime: startDateTime,
                modifiedCheckOutTime: endtimeChange?  endDateTime : ""

            }
            // console.log("data", data);
            // return;
            if(data.modifiedCheckOutTime && (new Date(data.modifiedCheckOutTime) < new Date(data.modifiedCheckInTime))){
                
            toast.warning("Invalid punch out time", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                return
            }

            const att = await modifySingleAttendene(data, jwt);
            if (att.status === 200) {
                handleModalClose1()
                toast.success("Successfully Updated", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                getInfo(data?.userId);
            } else {
                toast.warning(att?.data?.message || "Something went wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })

            }
        } catch (err) {
            toast.warning("Something went wrong!", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })

        }
    }


    const totalHour = (sDate, eDate) => {
        const diffInMilliseconds = Math.abs(eDate - sDate);
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

        const hour = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        const minuteValuInStr = minutes < 10 ? `0${minutes}` : minutes
        // console.log(diffInHours);
        return `${hour}:${minuteValuInStr}`
    }

    const searchedDate = (dateStr) => {
        const todayDate = new Date()
        const latestYear = todayDate.getFullYear()
        const latestMonth = todayDate.getMonth() + 1;
        const latestDate = todayDate.getDate()

        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const lastDateOfMonth = new Date(year, month, 0).getDate();

        let formattedDate
        if ((latestYear === year) && (latestMonth === month)) {
            formattedDate = `${year}-${month.toString().padStart(2, '0')}-${latestDate.toString().padStart(2, '0')}`;
        } else {
            formattedDate = `${year}-${month.toString().padStart(2, '0')}-${lastDateOfMonth.toString().padStart(2, '0')}`;
        }

        setFilteredDate(formattedDate)

    }

    const overTime = (sDate, eDate) => {
        const time = parseFloat(totalHour(sDate, eDate)) - 9
        if (time <= 0) return 0
        else return time.toFixed(2)
    }

    let timeDiff
    // new Date(localStorage.getItem('punchedInTime')).getTime()
    let hours
    let minutes
    let hoursText
    let minutesText

    function updateTime() {
        // console.log("Hitted");
        // console.log("punched update Time",punchedInfo.checkInTime);
        timeDiff = new Date().getTime() - new Date(punchedInfo.checkInTime).getTime()
        hours = Math.floor(timeDiff / (1000 * 60 * 60));
        minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

        minutes++;
        if (minutes === 60) {
            hours++;
            minutes = 0;
        }
        hoursText = hours?.toString()?.padStart(2, "0");
        minutesText = minutes?.toString()?.padStart(2, "0");

        document.getElementById("time").innerText = `${hoursText} : ${minutesText}`

    }


    const getInfo = async (userId) => {

        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/getall`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({
                "userId": userId || decodedUser._id,
                "monthDateYear": new Date()
            }),
            credentials: 'include',
            withCredentials: true
        })

        const data = await res.json()
        // console.log(" Table Data", data);
        if (res.status === 200) {
            setAttendenceList(data.attendenceList)
            setTotalWH(data?.totalHours)
        } else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    const getPunchedInfo = async () => {
        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/today`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({
                "checkInTime": new Date(),
            }),
            credentials: 'include',
            withCredentials: true
        })

        const data = await res.json()
        // console.log(" Punched Data", data);
        if (res.status === 200) {
            setPunchedInfo(data.punched)
            // setAttendenceList(data.attendenceList)
            if (data.punched === '') {
                setIsPunchedIn(false)
            } else if (!data.punched.checkOutTime) {
                setIsPunchedIn(true)
                const localTime = formatAMPM(new Date(data?.punched?.checkInTime))
                setPunchedTime(localTime)
                // console.log("Checkin Time", data?.punched?.checkInTime);
            } else {
                setIsPunchedIn(false)
            }
        } else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    const getAllUser = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/users/userlist`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
        })
        const data = await res.json()
        
        // console.log("All User", data);
        if (res.status === 200) {
            setAllUser(data.data[0].result)
            setLoading(false)
        } else {
            setLoading(false)
            // toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }   

    }

    const fetchIndividualAttendance = async () => {
        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/getall`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({
                "userId": filteredId,
                "monthDateYear": filteredDate
            }),
            credentials: 'include',
            withCredentials: true
        })

        const data = await res.json()
        // console.log(" Table Data", data);
        if (res.status === 200) {
            setAttendenceList(data.attendenceList);
            // console.log(data);
            setTotalWH(data?.totalHours)

        } else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    useEffect(() => {
        if (punchedInfo?.checkInTime && !punchedInfo?.checkOutTime) {
            // console.log("punched UseEffect",punchedInfo.checkInTime);
            const intervalId = setInterval(updateTime, 60000);

            return () => clearInterval(intervalId);
        }

        // if (localStorage.getItem('punchedInTime')) {
        //     const intervalId = setInterval(updateTime, 60000);

        //     return () => clearInterval(intervalId);
        // }

    }, [punchedInfo])

    useEffect(() => {
        getInfo()
        getPunchedInfo()
        if(userRole() === "Admin" || userRole() === "Project Lead" || userRole() === "Team Lead" ){
            getAllUser()

        }
    }, [])


    useLayoutEffect(() => {
        // if (localStorage.getItem('punchedInTime')) {
        //     document.getElementById("time").innerText = `${hours?.toString()?.padStart(2, "0")} : ${minutes?.toString()?.padStart(2, "0")}`
        // }
        if (punchedInfo?.checkInTime && !punchedInfo?.checkOutTime) {
            updateTime()
            // console.log("Another Effect",punchedInfo?.checkInTime,hoursText,minutesText);

            document.getElementById("time").innerText = `${hoursText?.toString()?.padStart(2, "0")} : ${minutesText?.toString()?.padStart(2, "0")}`
        }

    }, [punchedInfo])

    return (
        <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px" }}>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Attendance</Typography>
            </Box>
            {/* Punch card Section */}
            <Box className={classes.cardWrapper}>
                <Card elevation={4} sx={{ width: '60%' }}>
                    <CardContent>
                        <Typography sx={{ fontWeight: 'bolder' }}>Time Sheet<span className={classes.timeColor}> {formatDateMonth()} </span></Typography>
                        <Box className={classes.paperDesign}>
                            <Typography className='text-center'>Punched In at {punchedTime}</Typography>
                        </Box>
                        {/* Hour Circle */}
                        <Box className={classes.circleWrapper}>
                            <Box className={classes.circle}>
                                <Typography variant="h6" id='time'></Typography>
                            </Box>
                        </Box>
                        <Box className={classes.button}>
                            {
                                isPunchedIn ? <Button variant="contained" onClick={() => { punchOut() }}>Punch Out</Button> : <Button variant="contained" onClick={handleClickOpen}>Punch In</Button>
                            }

                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ width: "60%", margin: "10px auto" }}>
                <Card elevation='4' sx={{ maxHeight: 345, padding: "10px 0px 10px 0px" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Total Working Hours</Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{totalWH}</Typography>
                    </Box>
                </Card>
            </Box>
            {/* Searching Div */}
            {/* { */}
                
                <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px", maxWidth: '2618px', width: "100%" }}>
                    <Grid container spacing={3}>
                        {(userRole() === 'Admin' || userRole() === "Project Lead" || userRole() === "Team Lead") &&  <Grid item xs={12} sm={6} md={4} >
                            <FormControl sx={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-label">Select Employee</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Age"
                                    onChange={(e) => {
                                        setFilteredId(e.target.value)
                                    }}
                                >
                                    <MenuItem value={decodedUser?._id}>{decodedUser?.firstName}</MenuItem>
                                    {
                                        allUser && allUser.map((val, ind) => {
                                            return (
                                                <MenuItem value={val._id}>{val.firstName}</MenuItem>
                                                )
                                            })
                                        }
                                </Select>
                            </FormControl>
                        </Grid>}
                        {/* Select Month And Year*/}
                        <Grid item xs={12} sm={6} md={4} >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label={'Select Month and Year'} views={['month', 'year']} onChange={(e) => { searchedDate(e['$d']) }} sx={{ maxHeight: 200, width: '100%' }} />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} >
                            <Button variant="contained" sx={{ height: '55px', maxHeight: 200, width: '100%' }} onClick={fetchIndividualAttendance}>Search</Button>
                        </Grid>
                    </Grid>
                </Box>
            {/* } */}

            
            <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", marginBottom: "30px", minWidth: '600px', maxWidth: '2618px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Name</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Date</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Punch In</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Punch Out</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Total Hour</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Overtime</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Actions</StyledTableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            attendenceList.map((row, ind) => (
                                <StyledTableRow
                                    key={ind}
                                // style={{ backgroundColor: row?.isModified ? "#FEA1A1" : "" }}
                                >

                                    <StyledTableCell component="th" scope="row">
                                        {row?.name}
                                    </StyledTableCell>


                                    <StyledTableCell component="th" scope="row">
                                        {row?.key}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" style={{ }} >
                                        {row?.modifiedCheckInTime === row?.checkInTime ? 
                                        <>
                                            {row?.checkInTime ? formatAMPM(new Date(row?.checkInTime)) : ""}

                                        </> : <>
                                            {row?.modifiedCheckInTime &&  <>  {formatAMPM(new Date(row?.modifiedCheckInTime))} <span style={{color: "grey"}}>(Edited)</span> </>
                                            }
                                            {row?.checkInTime ? (<> <br /> {formatAMPM(new Date(row?.checkInTime))} </>) : ""}

                                        </>}
                                        {/* {row?.modifiedCheckInTime && (<Tooltip title="edited">
                                            <PriorityHighIcon sx={{ color: "red" }} />
                                        </Tooltip>)} */}

                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" style={{  }}>
                                        {row?.modifiedCheckOutTime === row?.checkOutTime ? <>
                                            {row?.checkOutTime ? formatAMPM(new Date(row?.checkOutTime)) : ""}

                                        </> : <>
                                            {row?.modifiedCheckOutTime && <>  {formatAMPM(new Date(row?.modifiedCheckOutTime))} <span style={{color: "grey"}}>(Edited)</span> </>}
                                            {/* <br /> */}
                                            {row?.checkOutTime ? (<> <br />{formatAMPM(new Date(row?.checkOutTime))} </>) : ""}

                                        </>}
                                        {/* {row?.modifiedCheckOutTime && (<Tooltip title="edited">
                                            <PriorityHighIcon sx={{ color: "red" }} />
                                        </Tooltip>)} */}

                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {(row?.checkOutTime || row?.modifiedCheckOutTime) ? totalHour(new Date(row?.modifiedCheckInTime || row?.checkInTime).getTime(), new Date(row?.modifiedCheckOutTime || row?.checkOutTime).getTime()) : ""}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {(row?.checkOutTime || row?.modifiedCheckOutTime) ? overTime(new Date(row?.modifiedCheckInTime || row?.checkInTime).getTime(), new Date(row?.modifiedCheckOutTime || row?.checkOutTime).getTime()) : ""}

                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        <Tooltip title="Edit">
                                            <EditIcon onClick={(e) => {
                                                
                                                handleUpateSingleAttendece(row)

                                            }} />
                                        </Tooltip>

                                        {row?.isModified && (
                                            <Tooltip title="edited">
                                                <PriorityHighIcon sx={{ color: "red" }} />
                                            </Tooltip>

                                        )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Modal */}
            <BootstrapDialog
                onClose={handleClickClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleClickClose}>
                    Select Your Position
                </BootstrapDialogTitle>
                <DialogContent >
                    <Typography>
                        Name
                    </Typography>
                    {/* <TextField id="outlined-search" label="Holiday Name *" type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} /> */}
                    <FormGroup sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} onClick={(e) => { handlePosition(e) }}>
                        <FormControlLabel control={<Checkbox />} value='WFH' checked={checkBoxDisableHome} label="Work From Home" />
                        <FormControlLabel control={<Checkbox />} value='WAO' checked={checkBoxDisableOffice} label="Work At Office" />
                        <FormControlLabel control={<Checkbox />} value='WOH' label="Work On Holiday" />
                        <FormControlLabel control={<Checkbox />} value='HD' label="Half day" />
                    </FormGroup>

                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
                        handleClickClose()
                        punchIn()
                    }}>
                        Punch
                    </Button>
                </DialogActions>
            </BootstrapDialog>


            {/* modal for attendence update */}

            <BootstrapDialog
                onClose={handleModalClose1}
                aria-labelledby="customized-dialog-title"
                open={open1}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleModalClose1} >
                    Attendence Update {new Date(updateAttendence?.key).toDateString()}
                </BootstrapDialogTitle>
                <DialogContent >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["TimePicker"]}>
                            <TimePicker
                                sx={{
                                    width: .9,
                                    // transition: "height 0.3s ease"
                                }}
                                slotProps={{
                                    textField: {
                                        error: false,
                                    },
                                }}

                                value={dayjs(startDateTime && startDateTime)}
                                label="Start Time"

                                onChange={(e) => {
                                    console.log("start time", startDateTime);
                                    let customizeDateTime = new Date(startDateTime);
                                    const extractTime = new Date(e["$d"])?.toTimeString();
                                    const splitinngTime = extractTime.split(" ")[0].split(":");
                                    customizeDateTime.setHours(splitinngTime[0])
                                    customizeDateTime.setMinutes(splitinngTime[1])

                                    setStartDateTime(customizeDateTime)
                                    // handleTimeChange("05/01/2023")
                                }}



                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    {/* <Box sx={{display: "flex", justifyContent: "space-between", alignItems:"center"}}> */}
                    {(punchoutUpdate || updateAttendence?.checkOutTime) ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["TimePicker"]} >
                            <TimePicker 
                                sx={{
                                    width: .9,
                                    // flex: "4",
                                    // flexFlow: 1
                                }}
                                // slotProps={{
                                //     textField: {
                                //         error: false,
                                //     },
                                // }}
                                value={dayjs(endDateTime && endDateTime)}
                                label="End Time"
                                onChange={(e) => {
                                    setEndDateTimeChanged(true);
                                    
                                    let customizeDateTime = new Date(typeof endDateTime !== 'string' ? updateAttendence.key : endDateTime );
                                    console.log("end time", typeof endDateTime);

                                    const extractTime = new Date(e["$d"])?.toTimeString();
                                    const splitinngTime = extractTime.split(" ")[0].split(":");
                                    customizeDateTime.setHours(splitinngTime[0])
                                    customizeDateTime.setMinutes(splitinngTime[1])

                                    setEndDateTime(customizeDateTime)

                                    
                                }}

                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    ):""}
                    {(!updateAttendence?.checkOutTime) && (

                    !punchoutUpdate ? (
                    <span onClick={(e)=> setPunchutUpdate(!punchoutUpdate) } style={{textDecoration: "underline", cursor: "pointer", color: "black"}} >Want to update punch out time?</span>

                    ) : (
                    <span onClick={(e)=> {
                        setPunchutUpdate(!punchoutUpdate)
                        setEndDateTimeChanged(false)
                
                    }} style={{textDecoration: "underline", cursor: "pointer", color: "rebeccapurple"}} >Not want to update punch out time?</span>

                    )
                    )}
                    {/* <ToggleButton
                        value="check"
                        // selected={selected}
                        onChange={() => {
                            // setSelected(!selected);
                        }}
                        >
                        <CheckIcon />
                    </ToggleButton> */}
                    {/* </Box> */}
                    {/* <TextField id="outlined-search" label="Holiday Name *" type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} /> */}
                    {/* { handlePosition(e) } */}
                    <FormGroup sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} onClick={(e) => { handlePosition(e) }}>
                        <FormControlLabel control={<Checkbox />} value='WFH' checked={checkBoxDisableHome} label="Work From Home" />
                        <FormControlLabel control={<Checkbox />} value='WAO' checked={checkBoxDisableOffice} label="Work At Office" />
                        <FormControlLabel control={<Checkbox />} value='WOH'  checked= {checkBoxWOH} onChange={(e)=> setCheckBoxWOH(e.target.checked)} label="Work On Holiday" />
                        
                        <FormControlLabel control={<Checkbox />} checked={checkBoxHD} onChange={(e)=> setCheckBoxHD(e.target.checked)}  value='HD' label="Half day" />
                        
                    </FormGroup>

                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        disabled={
                            (position?.length > 0 &&
                                updateAttendence?.userId
                                && startDateTime
                                // &&
                                // (new Date(startDateTime).getTime() < new Date(endDateTime).getTime())
                            ) ? false : true}
                        variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
                            updateUserAttendence()
                        }}>
                        Update
                    </Button>
                </DialogActions>
            </BootstrapDialog>

        </Box>
    )
}

export default Punch