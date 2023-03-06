import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
// importing Date picker component
import dayjs from 'dayjs';
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

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

function createData(No, title, holiday, day) {
    return { No, title, holiday, day };
}

const rows = [
    createData(1, "Office Tour", '9 Jan 2023', 'Monday'),
    createData(2, "International Mother Language day", '21 feb 2023', 'Tuesday'),
    createData(3, "Sab-e-barat", '8 mar 2023', 'Tuesday'),
    createData(4, "Shok dibos", '17 mar 2023', 'Fiday'),
];

const Holidays = () => {
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
                <MenuItem key={setting} onClick={()=>{handleClickOpen()
                    handleClose()
                }}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
            ))}
        </Menu>
    )
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Holidays 2023</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleClickOpen}>
                    Add Holiday
                </Button>
            </Box>
            <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", minWidth: '600px', width: "82vw" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>No</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Title</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Holiday Date</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Day</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold" }}>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, ind) => (
                            <StyledTableRow
                                key={row.name}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {row.No}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.title}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.holiday}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.day}
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
                    Add Holiday
                </BootstrapDialogTitle>
                <DialogContent >
                    <TextField id="outlined-search" label="Holiday Name *" type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} />
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} >
                            <DatePicker label="Add Date *" sx={{ width: 365, maxHeight: 345,}}/>
                        </DemoContainer>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions sx={{display:"flex",justifyContent:"center"}}>
                    <Button variant="contained" sx={{borderRadius:"50px",width:150}}autoFocus onClick={handleClickClose}>
                        Submit
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}

export default Holidays