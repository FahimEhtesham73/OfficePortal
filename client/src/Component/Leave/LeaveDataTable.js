import { Box, Button, ClickAwayListener, DialogActions, DialogContent, FormControl, InputLabel, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, styled, tableCellClasses } from '@mui/material';

import React, { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import userInfo from '../Hook/useUseInfo';
import { leaveReducerState } from './leaveReducer';
import { deleteALeaveApi, updateALeaveAPI } from '../../api/leaveRequestApi';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Modal from '../Hook/modal/Modal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { daysCount, totalHolidays } from '../functions/commonFunc';
import userRole from '../Hook/userHook';
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
const LeaveDataTable = (props) => {
    const jwt = localStorage.getItem('_token')
    const user = userInfo()
    const role = userRole()
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [leaveRequest, setLeaveRequest] = useState({
        id: "",
        userId: "",
        duration: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        totalDay: "",
        leaveReason: "",
        isHoliday: false
    })

    let { data, dispatch } = props;


    // For Action icon open
    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
    };
    // For Action icon close
    const handleClose = () => {
        setAnchorEl(null);
    };

    // For Modal open
    const handleClickOpen = () => {
        setOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setOpen(false);
        dispatch({ type: leaveReducerState.EMPTYDATA })

    };


    const handleEditFun = () => {
        let row = data.singleLeave;
        handleClickOpen()
        handleClose()
        setLeaveRequest({
            id: row?._id,
            userId: row?.userId,
            leaveReason: row?.leaveReason,
            leaveType: row?.leaveType,
            totalDay: row?.totalDay,
            startDate: row?.startDate,
            endDate: row?.endDate,
            duration: row?.totalDay >= 1 ? "range" : "halfday",
            isHoliday: false

        })
    }


    const updateALeaveDetails = async () => {
        const data = {
            _id: leaveRequest.id,
            userId: leaveRequest.userId,
            leaveType: leaveRequest.leaveType,
            startDate: leaveRequest.startDate,
            endDate: leaveRequest.endDate,
            totalDay: leaveRequest.totalDay,
            leaveReason: leaveRequest.leaveReason,
        }

        const response = await updateALeaveAPI(data, jwt);
        if (response.status === 200) {
            handleClickClose()
            await props.getLeaveData()
            toast.success("Updated Successfully", {
                position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false
            })

        } else {
            toast.warning("Something Went wrong", {
                position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false
            })
        }
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

    function createData(name, type, from, to, day, reason, status) {
        return { name, type, from, to, day, reason, status, };
    }

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
            {/* {settings.map((setting) => ( */}
            <MenuItem onClick={() => {
                handleClickOpen()
                handleClose()
            }}>
                <Typography textAlign="center">Edit</Typography>
            </MenuItem>

            <MenuItem onClick={(e) => {
                handleClickOpen()
                handleClose()
            }}>
                <Typography textAlign="center">Delete</Typography>
            </MenuItem>

            {/* ))} */}
        </Menu>
    )
    return (
        <>
            <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", maxWidth: '2618px' }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Leave type</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>From</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>To</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>No of Days</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Reason</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Status</StyledTableCell>
                            {(role === "Admin" || role === "Project Lead") ? null : (
                                <StyledTableCell sx={{ fontWeight: "bold" }}>Approved By</StyledTableCell>

                            )}
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.leaves.map((row, ind) => {
                            return (

                                <StyledTableRow
                                    key={ind}
                                >
                                    <StyledTableCell component="th" scope="row">
                                        {row.leaveType.toUpperCase()}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row?.startDate ? new Date(row?.startDate).toDateString() : "N/A"}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row?.endDate ? new Date(row?.endDate).toDateString() : "N/A"}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.totalDay}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        <Tooltip title={row.leaveReason}>
                                            <VisibilityIcon />
                                        </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row?.isDeclined ? 'Declined' : (row?.isFullyApproved && row?.isAllLeaderApproved && row?.isAllSuperVisorApproved) ? "Approved" : "Pending"}
                                    </StyledTableCell>
                                    {(role === "Admin" || role === "Project Lead") ? null : (
                                        <StyledTableCell component="th" scope="row">
                                            {/* {row?.} */}

                                            <Tooltip

                                                sx={{ whiteSpace: "pre-line" }}
                                                title={[...row.leaderDetails, ...row.supervisorDetails].filter(v => v?._id !== user?._id).map(v => `${v.firstName}: ${v.isApproved} `).join(", ")}
                                            >
                                                <VisibilityIcon sx={{ cursor: "pointer" }} />
                                            </Tooltip>

                                        </StyledTableCell>

                                    )}
                                    <StyledTableCell component="th" scope="row">
                                        {((row?.approvedByLeader?.filter(v => (v.isApproved === "Approved" && v.tId !== userInfo()._id)).length > 0 || row?.approvedBySuperVisor?.filter(v => (v.isApproved === "Approved" && v.sId !== userInfo()._id)).length > 0) || (row?.userId?.toString() === userInfo()._id?.toString() && role === "Admin") || (row.isFullyApproved || row.isDeclined)) ? null : (
                                            <IconButton aria-label="settings" >
                                                <MoreVertIcon onClick={(e) => {
                                                    handleClick(e, row)
                                                    dispatch({ type: leaveReducerState.VIEW_DATA, payload: row })
                                                }

                                                } />
                                            </IconButton>

                                        )}

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

                                            <MenuItem onClick={handleEditFun}  >

                                                <Typography
                                                    textAlign="center">Edit</Typography>
                                            </MenuItem>

                                            <MenuItem onClick={(e) => {
                                                handleClose()
                                                deleteAleave(data.singleLeave._id)
                                            }}>
                                                <Typography textAlign="center">Delete</Typography>
                                            </MenuItem>


                                            {/* ))} */}
                                        </Menu>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* modal */}

            <Modal title={"Update Leave"} open={open} handleClickClose={handleClickClose}>
                <DialogContent sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 0px 0px 0px" }}>
                            <InputLabel id="demo-simple-select-label">Select leave type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={age}
                                value={leaveRequest.leaveType}
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
                                value={leaveRequest?.duration}
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
                                    // slotProps={{
                                    //     textField: {
                                    //         error: false,
                                    //     },
                                    // }}
                                    label="From *" sx={{ width: 365, maxHeight: 345, }} value={dayjs(leaveRequest?.startDate)} onChange={(e) => {
                                        if (e?.['$d']) {
                                            setLeaveRequest({ ...leaveRequest, startDate: e["$d"], endDate: e["$d"], totalDay: 0.5 })

                                        }
                                    }}
                                />
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
                                        label="From *" value={dayjs(leaveRequest?.startDate)} sx={{ width: 365, maxHeight: 345, }}
                                        onChange={(e) => {
                                            if (e?.['$d']) {
                                                setLeaveRequest({ ...leaveRequest, startDate: new Date(new Date(e['$d']).setHours(0, 0, 0, 0)) })

                                            }

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
                                        label="To *" value={dayjs(leaveRequest?.endDate)} sx={{ width: 365, maxHeight: 345, }}
                                        onChange={(e) => {
                                            if (e?.['$d']) {

                                                let endDate = new Date(new Date(e['$d']).setHours(23, 59, 59, 999));
                                                let startDate = new Date(new Date(leaveRequest.startDate).setHours(0, 0, 0, 0));
                                                let holidaysCount = totalHolidays(startDate, endDate)
                                                let total = daysCount(new Date(endDate), new Date(leaveRequest.startDate)) - holidaysCount;


                                                setLeaveRequest({ ...leaveRequest, endDate: new Date(new Date(e['$d']).setHours(23, 59, 59, 999)), totalDay: total === "NaN" ? "Invaid date time" : total, isHoliday: holidaysCount > 0 ? true : false })
                                            }

                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </>
                    )
                    }
                    <TextField id="outlined-search" label="Number of Days *"

                        error={(leaveRequest?.totalDay && parseFloat(leaveRequest?.totalDay) <= 0) ? true : false}
                        value={leaveRequest?.duration === "halfday" ? 0.5 : (leaveRequest?.startDate && leaveRequest?.endDate) && leaveRequest?.totalDay}
                        readOnly

                        type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 10px 0px", pointerEvents: "none" }} />
                    {/* {leaveRequest.isHoliday && <span style={{ color: "#FF5252" }}>You are selecting date with hoilday</span>} */}
                    <TextField id="outlined-search" label="Reason *"
                        onChange={(e) => {
                            setLeaveRequest({ ...leaveRequest, leaveReason: e.target.value })
                        }}
                        value={leaveRequest?.leaveReason}
                        type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} />

                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={(e) => {
                        updateALeaveDetails()

                    }}>
                        Update
                    </Button>
                </DialogActions>
            </Modal>
        </>
    )
}


export default LeaveDataTable