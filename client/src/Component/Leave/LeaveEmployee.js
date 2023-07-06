import React, { useEffect, useReducer, useState } from 'react'
import { responsiveFontSizes, styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import userInfo from "../Hook/useUseInfo"
import { createLeaveApi, createLeaveApiForSup, getLeaveApi, leaveSummeryApi } from '../../api/leaveRequestApi';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import userRole from '../Hook/userHook';
import { totalHolidays } from '../functions/commonFunc';
import {  leaveReducer, leaveReducerInitialState, leaveReducerState } from './leaveReducer';
import LeaveDataTable from './LeaveDataTable';

const daysCount = (date_1, date_2) => {
    if (date_1 && date_2) {
        console.log("achi");
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;

    } else {
        return 0
    }
}

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

// Modal Styling
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

function checkLeapYear(year) {

    //three conditions to find out the leap year
    if ((0 === year % 4) && (0 !== year % 100) || (0 === year % 400)) {
        return true
    } 
    return false
}
const leaveStat = [
   
    {
        _id: "Casual",
        name: 'Casual Leave taken',
    },
    {
        _id: "Sick",
        name: 'Sick Leave Taken',
    },
    {
        _id: "Special",
        name: 'Special Leave Taken',
    },
    

]
const YEAR = new Date().getFullYear()

// const yearStartDate = new Date(`03/01/${year}`)
// const yearEndDate = new Date(`02/28/${year+1}`)
const LeaveEmployee = () => {
    const jwt = Cookies.get('_token');

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [search, setSearch] = useState({
        leaveType: "",
        leaveStatus: "",
        startDate: new Date(`03/01/${YEAR}`),
        endDate: checkLeapYear(YEAR+1) ? new Date(`02/29/${YEAR+1}`) : new Date(`02/28/${YEAR+1}`)
    })
    const [leaveSummery, setLeaveSummery] = useState({});
    const userData = userInfo();

    const [leaveRequest, setLeaveRequest] = useState({
        userId: userData?._id,
        duration: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        totalDay: "",
        leaveReason: "",
        isHoliday: false

    })

    const [state, dispatch] = useReducer(leaveReducer, leaveReducerInitialState)

    // For Action icon open
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    // For Action icon close
    const handleClose = () => {
        setLeaveRequest({
            userId: userData?._id,
            leaveType: "",
            startDate: "",
            endDate: "",
            totalDay: "",
            leaveReason: ""

        })

    };
    // For Modal open
    const handleClickOpen = () => {
        setOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setOpen(false);
        setLeaveRequest({
            userId: userData?._id,
            leaveType: "",
            startDate: "",
            endDate: "",
            totalDay: "",
            leaveReason: ""

        })
    };
    function createData(type, from, to, day, reason, status, approvedby) {
        return { type, from, to, day, reason, status, approvedby };
    }


    const createALeaveRequest = async () => {
        try {
            if (leaveRequest.startDate > leaveRequest.endDate) {
                toast.warning("Invalid Date", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnHover: false,
                })
                return;
            }

            if (leaveRequest.startDate && leaveRequest.endDate && leaveRequest.leaveReason && leaveRequest.leaveType && leaveRequest.totalDay) {
                const data = {
                    userId: leaveRequest.userId,
                    leaveType: leaveRequest.leaveType,
                    totalDay: leaveRequest.totalDay,
                    leaveReason: leaveRequest.leaveReason,
                    startDate: new Date(leaveRequest.startDate).toISOString(),
                    endDate: new Date(leaveRequest.endDate).toISOString()


                }

                console.log(data);

                let response;
                if (userRole() === "Admin" || userRole() === "Project Lead") {
                    response = await createLeaveApiForSup(data, jwt)
                } else {
                    response = await createLeaveApi(data, jwt)

                }


                if (response.status === 200) {
                    setOpen(false)
                    toast.success("Successfully requested", {
                        position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false
                    })
                    getLeaveData()
                }

            }

            else {
                toast.warning("Mandatory field missing", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnHover: false,
                })
            }
        } catch (err) {

        }
    }
    // const rows = [
    //     createData('Casual Leave', "1 Jan 2023", '2 Jan 2023', '2 days', 'Going To Hospital', 'Approved', 'Nahid'),
    //     createData('Casual Leave', "18 Mar 2023", '18 Mar 2023', '1 day', 'Personal Leave', 'Approved', 'Nahid'),
    //     createData('Sick Leave', "2 Feb 2023", '2 Feb 2023', '1 day', 'Fever', 'Approved', 'Nahid'),
    //     createData('Sick Leave', "18 Feb 2023", '18 Feb 2023', '1 day', 'Stomach Pain', 'Approved', 'Nahid'),
    //     createData('Casual Leave', "1 Mar 2023", '1 Mar 2023', '1 day', 'Personal Leave', 'Approved', 'Nahid'),
    // ];

    const getLeaveSummary = async ()=> {
        const response = await leaveSummeryApi({userId: userData._id, year: search.startDate.getFullYear()}, jwt);
        if(response.status === 200) {
            const responseData = await response.json();
            console.log(responseData.data);
            setLeaveSummery(responseData.data)
        }else{
            console.log("nothing");
        }
    }

    const getLeaveData = async () => {
        const response = await getLeaveApi({usersId: [], ...search}, jwt);
        if(response.status === 200){
            let responseData = await response.json()
            console.log(responseData);
            dispatch({
                type: leaveReducerState.GET_DATA,
                payload: responseData?.data
            })
        }
    }

    useEffect(()=> {
        getLeaveData()
        getLeaveSummary()
    },[])
    const settings = ['Edit', 'Delete'];
    const menu = (
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => {
                    handleClickOpen()
                    handleClose()
                }}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
            ))}
        </Menu>
    )
    return (
        <Box sx={{ marginLeft: { sm: '30px', md: "280px" } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Leave</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleClickOpen}>
                    Apply Leave
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px", maxWidth: '2618px' }}>
                {/* <Grid container spacing={3} >
                    {leaveSummery?.totalYearlyLeave?.map((val, ind) => {
                        // margin: "10px 20px 20px 0px",
                        return (

                            <Grid item xs={12} sm={6} md={4} sx={{ width: '100%' }}>
                                <Card elevation='4' sx={{ maxHeight: 345, padding: "10px 0px 10px 0px" }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val.leaveCategory.toUpperCase()}</Typography>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val.leaveAmount}</Typography>
                                    </Box>
                                </Card>
                            </Grid>

                        )
                    })}
                </Grid> */}
                <Grid container spacing={3} >
                    {leaveStat?.map((val, ind) => {
                        // margin: "10px 20px 20px 0px",
                        return (

                            <Grid item xs={12} sm={6} md={4} sx={{ width: '100%' }}>
                                <Card elevation='4' sx={{ maxHeight: 345, padding: "10px 0px 10px 0px" }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val?.name}</Typography>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{leaveSummery?.totalTaken?.find(v=> v._id === val._id)?.total || 0}</Typography>
                                    </Box>
                                </Card>
                            </Grid>

                        )
                    })}
                </Grid>

            </Box>

             {/* Searching Div */}
             <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px", maxWidth: '2618px' }}>
                <Grid container spacing={3}>
                
                    {/* Leave type */}
                    <Grid item xs={12} sm={4} md={2} >
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label">Select leave type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                label="Select leave type"
                                onChange={(e)=> setSearch({...search, leaveType: e.target.value})}
                                >
                                <MenuItem value={"Casual"}>Casual</MenuItem>
                                <MenuItem value={"Sick"}>Sick</MenuItem>
                                <MenuItem value={"Special"}>Special Leave</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* Leave Status */}
                    <Grid item xs={12} sm={4} md={2} >

                        <FormControl sx={{ maxHeight: 345, width: '100%' }}>
                            <InputLabel id="demo-simple-select-label">Select Leave Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                
                                label="Select leave type"
                            onChange={(e)=> setSearch({...search, leaveStatus: e.target.value})}
                            >
                                <MenuItem value={"pending"}>Pending</MenuItem>
                                <MenuItem value={"approved"}>Accepted</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* Date From */}
                    <Grid item xs={12} sm={4} md={2} >

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ marginTop: "-8px" }}>
                                <DatePicker onChange={(e)=> {
                                    if(e?.['$y']){
                                        console.log(e);
                                        setSearch({
                                            ...search,
                                            startDate: new Date(`03/01/${e?.['$y']}`),
                                            endDate: checkLeapYear(e?.['$y']+1)? new Date(`02/29/${e?.['$y'] + 1}`) :new Date(`02/28/${e?.['$y'] + 1}`)
                                        })
                                    }
                                }} label="Year" views={['year']} sx={{ width: '100%', maxHeight: 345 }} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    {/* date To
                    <Grid item xs={12} sm={4} md={2} >

                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                            <DemoContainer components={['DatePicker']} sx={{ marginTop: "-8px" }}>
                                <DatePicker label="To" sx={{ width: '100%', maxHeight: 345, }} />
                            </DemoContainer>
                        </LocalizationProvider>

                    </Grid> */}
                    <Grid item xs={12} sm={4} md={2} >
                        <Button variant="contained" sx={{ height: '50px', width: '100%' }} onClick={()=> {getLeaveData(); getLeaveSummary()}}>Search</Button>
                    </Grid>
                </Grid>
            </Box>
        
        <LeaveDataTable data={state} dispatch={dispatch} getLeaveData={getLeaveData} />
                 

            {/* Modal */}
            <BootstrapDialog
                onClose={handleClickClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleClickClose}>
                    Apply Leave
                </BootstrapDialogTitle>
                <DialogContent sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 0px 0px 0px" }}>
                            <InputLabel id="demo-simple-select-label">Select leave type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                label="Select leave type"
                                onChange={(e) => {
                                    setLeaveRequest({ ...leaveRequest, leaveType: e.target.value, })


                                }

                                }
                            >
                                <MenuItem value={"Casual"}>Casual</MenuItem>
                                {/* <MenuItem value={"unpaid"}>UnPaid</MenuItem> */}
                                <MenuItem value={"Sick"}>Sick</MenuItem>
                                <MenuItem value={"Special"}>Special</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 0px 0px 0px" }}>
                            <InputLabel id="demo-simple-select-label">Select leave duration</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                label="Select leave duration"
                                onChange={(e) => {
                                    if (e.target.value === "halfday") {
                                        setLeaveRequest({ ...leaveRequest, duration: e.target.value, endDate: leaveRequest.startDate, totalDay: 0.5 })

                                    } else {

                                        setLeaveRequest({ ...leaveRequest, duration: e.target.value, endDate: "", })

                                    }

                                }

                                }
                            >
                                <MenuItem value={"halfday"}>Half Day</MenuItem>
                                <MenuItem value={"range"}>Range</MenuItem>

                            </Select>
                        </FormControl>
                    </Box>

                    {leaveRequest.duration === "halfday" ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DemoContainer components={['DatePicker']} >
                                <DatePicker
                                    slotProps={{
                                        textField: {
                                            error: false,
                                        },
                                    }}
                                    label="From *" sx={{ width: 365, maxHeight: 345, }} value={dayjs(leaveRequest.startDate)} onChange={(e) => {
                                        setLeaveRequest({ ...leaveRequest, startDate: e["$d"], endDate: e["$d"], totalDay: 0.5 })
                                    }} />
                            </DemoContainer>
                        </LocalizationProvider>


                    ) : (
                        <>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DatePicker']} >
                                    <DatePicker
                                        slotProps={{
                                            textField: {
                                                error: false,
                                            },
                                        }}
                                        label="From *" value={dayjs(leaveRequest.startDate)} sx={{ width: 365, maxHeight: 345, }}
                                        onChange={(e) => {

                                            setLeaveRequest({ ...leaveRequest, startDate: new Date(new Date(e['$d']).setHours(0, 0, 0, 0)) })
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DateTimePicker']}  >
                                    <DatePicker

                                        slotProps={{
                                            textField: {
                                                error: (leaveRequest.startDate && leaveRequest.endDate && leaveRequest.startDate > leaveRequest.endDate) ? true : false,
                                            },
                                        }}
                                        label="To *" value={dayjs(leaveRequest.endDate)} sx={{ width: 365, maxHeight: 345, }}
                                        onChange={(e) => {
                                            let endDate = new Date(new Date(e['$d']).setHours(23, 59, 59, 999));
                                            let startDate = new Date(new Date(leaveRequest.startDate).setHours(0, 0, 0, 0));
                                            let holidaysCount = totalHolidays(startDate, endDate)
                                            let total = daysCount(new Date(endDate), new Date(leaveRequest.startDate)) - holidaysCount;


                                            setLeaveRequest({ ...leaveRequest, endDate: new Date(new Date(e['$d']).setHours(23, 59, 59, 999)), totalDay: total === "NaN" ? "Invaid date time" : total, isHoliday: holidaysCount > 0 ? true : false })

                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </>
                    )
                    }
                    <TextField id="outlined-search" label="Number of Days *"
                        error={(leaveRequest?.totalDay && parseFloat(leaveRequest?.totalDay) <= 0) ? true : false}
                        value={leaveRequest.duration === "halfday" ? 0.5 : (leaveRequest.startDate && leaveRequest.endDate) && leaveRequest.totalDay}
                        readOnly
                        type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 10px 0px" }} />
                    {leaveRequest.isHoliday && <span style={{ color: "#FF5252" }}>You are selecting date with hoilday</span>}
                    <TextField id="outlined-search" label="Reason *"
                        onChange={(e) => {
                            setLeaveRequest({ ...leaveRequest, leaveReason: e.target.value })
                        }}
                        type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} />
                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={createALeaveRequest}>
                        Apply
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </Box>
    )
}

export default LeaveEmployee