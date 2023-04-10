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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';



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
        name: 'Annual Casual Leave',
        amount: 11
    },
    {
        name: 'Annual Sick Leave',
        amount: 7
    },
    {
        name: 'Casual Leave taken',
        amount: 3
    },
    {
        name: 'Sick Leave Taken',
        amount: 2
    },
    {
        name: 'Remaining Casual Leave',
        amount: 8
    },
    {
        name: 'Remaining Sick Leave',
        amount: 5
    },

]

const LeaveEmployee = () => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    // For Action icon open
    const handleClick = (event) => {
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
    };
    function createData(type, from, to, day, reason, status, approvedby) {
        return { type, from, to, day, reason, status, approvedby };
    }

    const rows = [
        createData('Casual Leave', "1 Jan 2023", '2 Jan 2023', '2 days', 'Going To Hospital', 'Approved', 'Nahid'),
        createData('Casual Leave', "18 Mar 2023", '18 Mar 2023', '1 day', 'Personal Leave', 'Approved', 'Nahid'),
        createData('Sick Leave', "2 Feb 2023", '2 Feb 2023', '1 day', 'Fever', 'Approved', 'Nahid'),
        createData('Sick Leave', "18 Feb 2023", '18 Feb 2023', '1 day', 'Stomach Pain', 'Approved', 'Nahid'),
        createData('Casual Leave', "1 Mar 2023", '1 Mar 2023', '1 day', 'Personal Leave', 'Approved', 'Nahid'),
    ];
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
        <Box sx={{marginLeft:{sm:'30px',md:"280px"}}}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Leave</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleClickOpen}>
                    Apply Leave
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px",maxWidth:'2618px' }}>
            <Grid container spacing={3} >
                {leaveStat.map((val, ind) => {
                    // margin: "10px 20px 20px 0px",
                    return (
                        
                            <Grid item xs={12} sm={6} md={4} sx={{width:'100%'}}>
                                <Card elevation='4' sx={{ maxHeight: 345, padding: "10px 0px 10px 0px" }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val.name}</Typography>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val.amount}</Typography>
                                    </Box>
                                </Card>
                            </Grid>
                    
                    )
                })}
            </Grid>

            </Box>
            <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", minWidth: 435, maxWidth:'2618px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Leave type</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>From</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>To</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>No of Days</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Reason</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Status</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Approved By</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, ind) => (
                            <StyledTableRow
                                key={ind}
                            >
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
                                    {row.status}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.approvedby}
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
        </Box>
    )
}

export default LeaveEmployee