import { Box, Button, Card, CardContent, Paper, Typography } from '@mui/material'
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
import { makeStyles } from '@material-ui/core';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';

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
    // For Modal open
    const handleClickOpen = () => {
        setOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setOpen(false);
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
        if (e.target.value === 'WFH') {
            if (position.includes('WFH')) {
                setCheckBoxDisableHome(false)
                const temp = position.filter((val) => { return val !== 'WFH' })
                setPosition(temp)
            } else {
                setCheckBoxDisableHome(true)
                setCheckBoxDisableOffice(false)
                const unchekedFilter = position.filter((val) => { return val !== 'WAO' })
                setPosition([...unchekedFilter, 'WFH'])
            }

        }
        else if (e.target.value === 'WAO') {
            if (position.includes('WAO')) {
                setCheckBoxDisableOffice(false)
                const temp = position.filter((val) => { return val !== 'WAO' })
                setPosition(temp)
            } else {
                setCheckBoxDisableOffice(true)
                setCheckBoxDisableHome(false)
                const unchekedFilter = position.filter((val) => { return val !== 'WFH' })
                setPosition([...unchekedFilter, 'WAO'])
            }

        } else {
            if (position.includes(e.target.value)) {
                const unchekedFilter = position.filter((val) => { return e.target.value !== val })
                setPosition(unchekedFilter)
            } else {
                setPosition([...position, e.target.value])
            }

        }

    }
    // console.log("work position", position);

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
                console.log("created punch data", data);
                toast.success("Punched In Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                localStorage.setItem('punchedInTime',data?.info?.checkInTime)
                const localTime = formatAMPM(new Date(data?.info?.checkInTime))
                setPunchedTime(localTime)
                setIsPunchedIn(true)
                document.getElementById("time").innerText = `00:00`
                getInfo()
            } else {
                toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            }
        }

    }

    const punchOut = async () => {
        console.log("Attendance ID", decoded?._id);
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
            localStorage.removeItem('punchedInTime')
            setIsPunchedIn(false)
            const localTime = formatAMPM(new Date(data.data.checkOutTime))
            toast.success(`You Punched Out At ${localTime}`, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            getInfo()
        }
    }


    const totalHour = (sDate, eDate) => {
        const diffInMilliseconds = Math.abs(eDate - sDate);
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
        // console.log(diffInHours);
        return diffInHours.toFixed(2)
    }

    const overTime = (sDate, eDate) => {
        const time = parseFloat(totalHour(sDate, eDate)) - 9
        if (time <= 0) return 0
        else return time
    }

    let timeDiff = new Date().getTime() - new Date(localStorage.getItem('punchedInTime')).getTime()
    let hours = Math.floor(timeDiff / (1000 * 60 * 60));
    let minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

    
    function updateTime() {
        minutes++;
        if (minutes === 60) {
            hours++;
            minutes = 0;
        }
        const hoursText = hours?.toString()?.padStart(2, "0");
        const minutesText = minutes?.toString()?.padStart(2, "0");

        document.getElementById("time").innerText = `${hoursText} : ${minutesText}`

    }


    const getInfo = async () => {
        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/getall`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            credentials: 'include',
            withCredentials: true
        })
        const data = await res.json()
        console.log("Data", data);
        if (res.status === 200) {
            setPunchedInfo(data.punched)
            setAttendenceList(data.attendenceList)
            if (data.punched === '') {
                setIsPunchedIn(false)
            } else if (!data.punched.checkOutTime) {
                setIsPunchedIn(true)
                const localTime = formatAMPM(new Date(data?.punched?.checkInTime))
                setPunchedTime(localTime)
            } else {
                setIsPunchedIn(false)
            }
        } else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    useEffect(()=>{
        if(localStorage.getItem('punchedInTime')){
            const intervalId = setInterval(updateTime, 60000);

            return () => clearInterval(intervalId);
        }
        
    },[localStorage.getItem('punchedInTime')])
    useEffect(() => {
        getInfo()
    }, [])


    useLayoutEffect(()=>{
        if(localStorage.getItem('punchedInTime')){
            document.getElementById("time").innerText = `${hours?.toString()?.padStart(2, "0")} : ${minutes?.toString()?.padStart(2, "0")}`
        }
        
    },[])

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
            {/* Searching Div */}
            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px", maxWidth: '2618px', width: "100%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} md={3} >
                        <TextField id="outlined-search" label="Employee ID" type="search" sx={{ maxHeight: 200, width: '100%' }} />
                    </Grid>
                    {/* Select Month */}
                    <Grid item xs={12} sm={4} md={3} >
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label">Select Month</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                label="Select Month"
                            // onChange={handleChange}
                            >
                                <MenuItem value={'jan'}>January</MenuItem>
                                <MenuItem value={'feb'}>February</MenuItem>
                                <MenuItem value={'mar'}>March</MenuItem>
                                <MenuItem value={'apr'}>April</MenuItem>
                                <MenuItem value={'may'}>May</MenuItem>
                                <MenuItem value={'june'}>June</MenuItem>
                                <MenuItem value={'july'}>July</MenuItem>
                                <MenuItem value={'aug'}>August</MenuItem>
                                <MenuItem value={'sep'}>September</MenuItem>
                                <MenuItem value={'oct'}>October</MenuItem>
                                <MenuItem value={'nov'}>November</MenuItem>
                                <MenuItem value={'dec'}>December</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* Leave Status */}
                    <Grid item xs={12} sm={4} md={3} >

                        <FormControl sx={{ width: '100%' }}>
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
                    </Grid>

                    <Grid item xs={12} sm={4} md={3} >
                        <Button variant="contained" sx={{ height: '50px', width: '100%' }}>Search</Button>
                    </Grid>
                </Grid>
            </Box>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            attendenceList.map((row, ind) => (
                                <StyledTableRow
                                    key={ind}
                                >
                                    <StyledTableCell component="th" scope="row">
                                        {decodedUser?.firstName}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row?.key}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row?.checkInTime?formatAMPM(new Date(row?.checkInTime)):""}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row?.checkOutTime ? formatAMPM(new Date(row?.checkOutTime)) : ""}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row?.checkOutTime ? totalHour(new Date(row.checkInTime).getTime(), new Date(row.checkOutTime).getTime()) : ""}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row?.checkOutTime ? overTime(new Date(row.checkInTime), new Date(row.checkOutTime)) : ""}
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

        </Box>
    )
}

export default Punch