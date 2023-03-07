import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



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
    const [open, setOpen] = useState(false);
    const [statusOpen,setStatusOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [statusachorEl,setStatusAnchorEl] = useState(null)

    // For Action icon open
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // For Action icon close
    const handleClose = () => {
        setAnchorEl(null);
    };
    // For Leave Status Option
    const statusHandleClick =(event)=>{
        setStatusAnchorEl(event.currentTarget)
    }
    // For Leave Status Option Close
    const statusHandleClose = () => {
        setStatusAnchorEl(null);
    };
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
    function createData(name,type, from, to, day, reason, status) {
        return { name,type, from, to, day, reason, status,};
    }

    const rows = [
        createData('Aminul','Casual Leave', "1 Jan 2023", '2 Jan 2023', '2 days', 'Going To Hospital', 'Approved'),
        createData('Abir', 'Casual Leave', "18 Mar 2023", '18 Mar 2023', '1 day', 'Personal Leave', 'Approved'),
        createData('Jahid','Sick Leave', "2 Feb 2023", '2 Feb 2023', '1 day', 'Fever', 'Approved',),
        createData('Faysal','Sick Leave', "18 Feb 2023", '18 Feb 2023', '1 day', 'Stomach Pain', 'Approved'),
        createData('Abir','Casual Leave', "1 Mar 2023", '1 Mar 2023', '1 day', 'Personal Leave', 'Approved'),
    ];
    const settings = ['Edit', 'Delete'];
    const leaveStatusSettings = ['New','Pending','Approved','Declined']

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
                <MenuItem key={setting} onClick={() => {
                    statusHandleClose()
                }}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
            ))}
        </Menu>
    ) 
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Leave</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleClickOpen}>
                    Apply Leave
                </Button>
            </Box>
            {/* Card For leave Information */}
            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px" }}>
                {leaveStat.map((val, ind) => {
                    return (
                        <Card elevation='4' sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 20px 0px", padding: "10px 0px 10px 0px" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val.name}</Typography>
                                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val.amount}</Typography>
                            </Box>
                        </Card>
                    )
                })}

            </Box>
            {/* Searching Div */}
            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px" }}>
                <TextField id="outlined-search" label="Employee ID" type="search" sx={{ minWidth: 220, maxHeight: 200, margin: "10px 20px 40px 0px" }} />
                {/* Leave type */}
                <FormControl sx={{ minWidth: 220, maxHeight: 345, margin: "10px 20px 40px 0px" }}>
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
                {/* Leave Status */}
                <FormControl sx={{ minWidth: 220, maxHeight: 345, margin: "10px 20px 40px 0px" }}>
                    <InputLabel id="demo-simple-select-label">Select Leave Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Select leave type"
                    // onChange={handleChange}
                    >
                        <MenuItem value={10}>Pending</MenuItem>
                        <MenuItem value={20}>Accepted</MenuItem>
                        <MenuItem value={30}>Declined</MenuItem>
                        <MenuItem value={30}>New</MenuItem>
                    </Select>
                </FormControl>
                {/* Date From */}
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} sx={{ margin: "2px 20px 40px 0px"}}>
                            <DatePicker label="From" sx={{ width: 200, maxHeight: 345,}} />
                        </DemoContainer>
                </LocalizationProvider>
                {/* date To */}
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} sx={{ margin: "2px 20px 40px 0px"}}>
                            <DatePicker label="To" sx={{ width: 200, maxHeight: 345,}} />
                        </DemoContainer>
                </LocalizationProvider>

                <Button variant="contained" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }}>Search</Button>
            </Box>
            <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", minWidth: '600px', width: "82vw" }}>
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
                        {rows.map((row, ind) => (
                            <StyledTableRow
                                key={ind}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {row.name}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.type}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.from}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.to}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.day}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.reason}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    <div style={{border:'1px solid black',width:'100px',height:'20px',borderRadius:"50px",display:"flex",justifyContent:'center',alignItems:"center",cursor:"pointer"}} onClick={statusHandleClick}>{row.status} <ArrowDropDownIcon/></div>
                                    {statusMenu}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    <IconButton aria-label="settings" >
                                        <MoreVertIcon onClick={handleClick} />
                                    </IconButton>
                                    {menu}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
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
            </BootstrapDialog>
        </>
    )
}

export default LeaveStatusLead