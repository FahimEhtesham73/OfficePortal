import React, { useEffect, useReducer, useState } from 'react'
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core';
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
import Pagination from '@mui/material/Pagination';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import { deleteALeaveApi, getLeaveStatusApi, searchLeaveApi, updateALeaveStatusAPI } from '../../api/leaveRequestApi';
import userInfo from '../Hook/useUseInfo';
import Cookies from 'js-cookie';
import { leaveReducer, leaveReducerInitialState, leaveReducerState } from './leaveReducer';
import { Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import userRole from '../Hook/userHook';
import jwtDecode from 'jwt-decode';


const PAGESIZE = 2;
const useStyles = makeStyles((theme) => ({
    cardWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "60px",
        width: "100%",
        flexWrap: 'wrap'
    },
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

const leaveStat = [
    {
        name: 'Today Present',
        amount: 20
    },
    {
        name: 'Today Leave',
        amount: 6
    },
    {
        name: 'Work From Home',
        amount: 5
    },
    {
        name: 'Pending Request',
        amount: 5
    }
]

const LeaveStatusLead = () => {
    const jwt = localStorage.getItem('_token')
    const jwtUser = localStorage.getItem('_info')
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
    const [open, setOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [statusachorEl, setStatusAnchorEl] = useState(null)
    const [singleLeave, setSingleLeave] = useState({})
    const [allUser, setAllUser] = useState([])
    const [filteredId, setFilteredId] = useState("")
    const [search, setSearch] = useState({
        userId: filteredId,
        leaveType: "",
        isFullyApproved: "",
        startDate: "",
        endDate: ""
    })
    const [statusQuery, setStatusQuery] = useState({
        pageSize: PAGESIZE,
        // pageNumber: 1,
        totalCount: 0,
    })
    const [pageNumber, setPageNumber] = useState(1)
    const [isFilterApiCalling, setIsFilterApi] = useState(false);


    const [state, dispatch] = useReducer(leaveReducer, leaveReducerInitialState)
    // For Action icon open
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // For Action icon close
    const handleClose = () => {
        setAnchorEl(null);
    };
    // For Leave Status Option
    const statusHandleClick = (event, value) => {
        if ((userRole() === "Admin" && value.isAdminApproved === "Pending") || (userRole() !== "Admin" && value.isApproved[0] === "Pending")) {
            setStatusAnchorEl(event.currentTarget)
        }
    }
    // For Leave Status Option Close
    const statusHandleClose = (e) => {
        dispatch({
            type: leaveReducerState.EMPTYDATA
        })
        setStatusAnchorEl(null);
    };
    const handleChange = (e) => {
        const name = e.target.name;
        const val = e.target.value;
        setSearch({
            ...search,
            [name]: val,
        })
    }
    // For Modal open
    const handleClickOpen = () => {
        setOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setOpen(false);
    };
    // For Leave Status Modal open
    const statusHandleClickOpen = () => {
        setStatusOpen(true);
    };
    // For Modal Close
    const statusHandleClickClose = () => {
        setStatusOpen(false);
    };
    function createData(name, type, from, to, day, leaveReason, status) {
        return { name, type, from, to, day, leaveReason, status, };
    }

    const deleteAleave = async (id) => {
        const response = await deleteALeaveApi(id, jwt)
        if (response.status === 200) {
            dispatch({ type: leaveReducerState.DELETE_DATA, payload: id })
            toast.success("Deleted Successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            })
        } else {
            toast.warning("Unsuccess", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            })
        }
    }

    const rows = [
        createData('Aminul', 'Casual Leave', "1 Jan 2023", '2 Jan 2023', '2 days', 'Going To Hospital', 'Approved'),
        createData('Abir', 'Casual Leave', "18 Mar 2023", '18 Mar 2023', '1 day', 'Personal Leave', 'Approved'),
        createData('Jahid', 'Sick Leave', "2 Feb 2023", '2 Feb 2023', '1 day', 'Fever', 'Approved',),
        createData('Faysal', 'Sick Leave', "18 Feb 2023", '18 Feb 2023', '1 day', 'Stomach Pain', 'Approved'),
        createData('Abir', 'Casual Leave', "1 Mar 2023", '1 Mar 2023', '1 day', 'Personal Leave', 'Pending'),
    ];
    const settings = ['Delete'];
    const leaveStatusSettings = ['Pending', 'Approved', 'Declined']

    const paginationHandle = (e, v) => {
        // setStatusQuery({
        //         ...statusQuery,
        //         pageNumber: v
        //     })
        setPageNumber(v)
        if (isFilterApiCalling) {
            searchLeave(v)
        } else {
            getLeaveStatus(v)
        }
    }
    useEffect(() => {
        getLeaveStatus(1)
        getAllUser()
    }, [])


    const getAllUser = async () => {
        const res = await fetch(`${process.env.REACT_APP_URL}/users/userlist`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
        })
        const data = await res.json()

        if (res.status === 200) {
            setAllUser(data.data[0].result)
        }

    }
    const searchLeave = async (pageNumber) => {


        if ((search.startDate !== '' && search.endDate === '') || (search.endDate !== '' && search.startDate === '') || (search?.startDate > search.endDate)) {

            toast.warning("Invalid Date range", {
                position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false
            })
            return
        }
        setIsFilterApi(true);
        // setStatusQuery({
        //     ...statusQuery,
        //     pageSize: PAGESIZE,
        //     pageNumber: pageNumber ? pageNumber: 1
        // })
        const response = await searchLeaveApi({ search: search, pageSize: statusQuery.pageSize, pageNumber: pageNumber || 1, selfId: decoded._id }, jwt);
        if (response.status === 200) {
            const responseData = await response.json()
            dispatch({
                type: leaveReducerState.GET_DATA,
                payload: responseData[0].data
            })
            setStatusQuery({ ...statusQuery, totalCount: responseData[0].totalCount })

        }
    }
    const getLeaveStatus = async (pageNumber) => {

        const response = await getLeaveStatusApi({ userId: userInfo()._id, pageNumber: pageNumber, pageSize: statusQuery.pageSize }, jwt);
        if (response.status === 200) {
            let responseData = await response.json();
            setStatusQuery({ ...statusQuery, totalCount: responseData[0].totalCount })
            dispatch({
                type: leaveReducerState.GET_DATA,
                payload: responseData[0].data
            })
        }
    }

    const updateStatus = async (data, status) => {
        const requestData = {
            leaveId: data._id,
            approverId: userInfo()._id,
            status: status
        }
        // return
        const response = await updateALeaveStatusAPI(requestData, jwt);
        if (response.status === 200) {
            toast.success("Success", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnHover: false,
            })
            await getLeaveStatus(pageNumber)
            dispatch({
                type: leaveReducerState.EMPTYDATA
            });
            setSingleLeave({})

        } else {
            dispatch({
                type: leaveReducerState.EMPTYDATA
            });
            setSingleLeave({})

            toast.warning("Not updated", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnHover: false,
            })
        }
    }
    // For Action icon menu open
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
            <MenuItem key={'delete'} onClick={() => {
                handleClickOpen()
                handleClose()
            }}>
                <Typography textAlign="center">Delete</Typography>
            </MenuItem>

        </Menu>
    )

    // For leave status menu open
    const statusMenu = (
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={statusachorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(statusachorEl)}
            onClose={statusHandleClose}
        >
            {leaveStatusSettings.map((setting) => (
                <MenuItem key={setting} onClick={(e) => {
                    statusHandleClose()
                }}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
            ))}
        </Menu>
    )
    return (
        <Box sx={{ marginLeft: { sm: '20px', md: "280px", xs: '20px' }, marginRight: "30px", maxWidth: '2618px' }}>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Leave</Typography>

            </Box>

            {/* Searching Div */}
            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px", maxWidth: '2168px' }}>
                <Grid container spacing={3} >
                    <Grid item xs={12} sm={4} md={2} >
                        {(userRole() === 'Admin' || userRole() === "Project Lead" || userRole() === "Team Lead") &&
                            (
                                <FormControl sx={{ width: '100%' }} >
                                    <InputLabel id="demo-simple-select-label"  >Select Employee</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        // value={age}
                                        label="Age"
                                        onChange={(e) => {
                                            setFilteredId(e.target.value)
                                            // handleChange(e)
                                            setSearch({ ...search, userId: e.target.value })
                                        }}
                                    >
                                        {/* <MenuItem value={decodedUser?._id}>{decodedUser?.firstName}</MenuItem> */}
                                        {
                                            allUser && allUser.map((val, ind) => {
                                                return (
                                                    <MenuItem value={val._id}>{val.firstName}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>

                            )}
                    </Grid>

                    {/* Leave type */}
                    <Grid item xs={12} sm={4} md={2} >
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label">Select leave type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                label="Select leave type"
                                name="leaveType"
                                onChange={handleChange}
                            >
                                <MenuItem value={"Casual"}>Casual</MenuItem>
                                <MenuItem value={"Sick"}>Sick</MenuItem>
                                <MenuItem value={"Special"}>Special Leave</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* Leave Status */}
                    {/* <Grid item xs={12} sm={4} md={2} >

                        <FormControl sx={{ maxHeight: 345, width: '100%', display:"none" }}>
                            <InputLabel id="demo-simple-select-label">Select Leave Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                name='leaveType'
                                label="Select leave type"
                            onChange={(e)=> {
                                if(e.target.value === "accepted"){
                                    setSearch({...search, isFullyApproved: true})
                                }else{
                                    setSearch({...search, isFullyApproved: false})

                                }
                            
                            }
                        }
                            >
                                <MenuItem value={"accepted"}>Accepted</MenuItem>
                                <MenuItem value={"declined"}>Not Accepted</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid> */}
                    {/* Date From */}
                    <Grid item xs={12} sm={4} md={2} >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ marginTop: "-8px" }}>
                                <DatePicker label="From" sx={{ width: '100%', maxHeight: 345, }}
                                    onChange={(e) => {
                                        if (e?.['$d']) {
                                            let d = new Date(e['$d']).setHours(0, 0, 0, 0)
                                            setSearch({ ...search, startDate: new Date(d) })
                                        }
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    {/* date To */}
                    <Grid item xs={12} sm={4} md={2} >

                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                            <DemoContainer components={['DatePicker']} sx={{ marginTop: "-8px" }}>
                                <DatePicker label="To" sx={{ width: '100%', maxHeight: 345, }} onChange={e => {
                                    if (e?.['$d']) {
                                        let d = new Date(e['$d']).setHours(0, 0, 0, 0)
                                        setSearch({ ...search, endDate: new Date(d) })
                                    }
                                }} />
                            </DemoContainer>
                        </LocalizationProvider>

                    </Grid>
                    <Grid item xs={12} sm={4} md={2} >
                        <Button variant="contained" sx={{ height: '50px', width: '100%' }}
                            onClick={(e) => searchLeave(1)}
                        >Search</Button>
                    </Grid>
                </Grid>
            </Box>
            <Grid container xs={12} sm={12} md={12}>
                <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", maxWidth: '2618px' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{ fontWeight: "bold" }}>Employee</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: "bold" }}>Leave type</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: "bold" }}>From</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: "bold" }}>To</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: "bold" }}>No of Days</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: "bold" }}>Reason</StyledTableCell>
                                <StyledTableCell sx={{ fontWeight: "bold" }}>Status</StyledTableCell>
                                {/* <StyledTableCell sx={{ fontWeight: "bold" }}>Approved By</StyledTableCell> */}
                                <StyledTableCell sx={{ fontWeight: "bold" }}>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state.leaves.map((row, ind) => (
                                <StyledTableRow
                                    key={ind}
                                >
                                    <StyledTableCell component="th" scope="row">
                                        {row.user}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.leaveType}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.startDate ? new Date(row.startDate).toDateString() : ""}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.endDate ? new Date(row.endDate).toDateString() : ""}

                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.totalDay}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        <Tooltip title={row.leaveReason}>
                                            <VisibilityIcon sx={{ cursor: "pointer" }} />
                                        </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" >
                                        <div style={{
                                            border: '1px solid', width: '100px', height: '20px', borderRadius: "50px", display: "flex", justifyContent: 'center', alignItems: "center", cursor: "pointer",
                                            color: ((userRole() !== "Admin" && row?.isApproved[0] === "Approved") || (userRole() === "Admin" && row?.isAdminApproved === "Approved")) ? "green" : ((userRole() !== "Admin" && row?.isApproved[0] === "Declined") || (userRole() === "Admin" && row?.isAdminApproved === "Declined")) ? "red" : "black"
                                            ,


                                        }} onClick={(e) => {
                                            statusHandleClick(e, row)
                                            setSingleLeave({ ...row })

                                        }}>{userRole() === "Admin" ? row.isAdminApproved : row?.isApproved[0]}

                                            <ArrowDropDownIcon sx={{
                                                display: ((userRole() !== "Admin" && row?.isApproved[0] !== "Pending") || (userRole() === "Admin" && row?.isAdminApproved !== "Pending")) ? "none" : "block"
                                            }} onClick={(e) => {
                                                dispatch({
                                                    type: leaveReducerState.VIEW_DATA,
                                                    payload: row
                                                })
                                                setSingleLeave(row)
                                            }} /></div>

                                        <Menu
                                            sx={{ mt: '45px' }}
                                            id="menu-appbar"
                                            anchorEl={statusachorEl}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(statusachorEl)}
                                            onClose={statusHandleClose}


                                        >
                                            {leaveStatusSettings.map((setting) => {
                                                return (
                                                    <MenuItem key={setting} value={setting} onClick={(e) => {
                                                        let status = e.currentTarget.childNodes[0].textContent;

                                                        updateStatus(singleLeave, status)
                                                        statusHandleClose(e)

                                                    }}>
                                                        <Typography textAlign="center" value={setting} >{setting}</Typography>
                                                    </MenuItem>
                                                )

                                            }
                                            )}
                                        </Menu>


                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {userRole() === "Admin" ? (
                                            <>

                                                <IconButton aria-label="settings" >
                                                    <MoreVertIcon onClick={(e) => {
                                                        dispatch({ type: leaveReducerState.VIEW_DATA, payload: row })
                                                        handleClick(e)
                                                    }
                                                    } />
                                                </IconButton>
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
                                                    <MenuItem key={'delete'} onClick={(e) => {
                                                        // handleClickOpen()
                                                        handleClose(e)
                                                        deleteAleave(state.singleLeave._id)
                                                    }}>
                                                        <Typography textAlign="center">Delete</Typography>
                                                    </MenuItem>

                                                </Menu>
                                            </>

                                        ) : null}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Box sx={{ width: "100%", marginTop: "50px", display: "flex", justifyContent: 'center' }}>
                <Pagination page={pageNumber} count={Math.ceil(statusQuery.totalCount / statusQuery.pageSize)}
                    onChange={(e, v) => paginationHandle(e, v)}
                />
            </Box>

            {/* Modal */}
            {/* <BootstrapDialog
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
                            // onChange={handleChange}
                            >
                                <MenuItem value={10}>Casual</MenuItem>
                                <MenuItem value={20}>Half day</MenuItem>
                                <MenuItem value={30}>Sick</MenuItem>
                                <MenuItem value={30}>Special Leave</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} >
                            <DatePicker label="From *" sx={{ width: 365, maxHeight: 345, }} />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} >
                            <DatePicker label="To *" sx={{ width: 365, maxHeight: 345, }} />
                        </DemoContainer>
                    </LocalizationProvider>
                    <TextField id="outlined-search" label="Number of Days *" type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} />
                    <TextField id="outlined-search" label="Reason *" type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} />
                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={handleClickClose}>
                        Apply
                    </Button>
                </DialogActions>
            </BootstrapDialog> */}
        </Box>
    )
}

export default LeaveStatusLead