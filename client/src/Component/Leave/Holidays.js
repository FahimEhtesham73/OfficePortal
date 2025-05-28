import React, { useEffect, useState } from 'react'
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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import userInfo from "../Hook/useUseInfo"
import Loading from '../Hook/Loading/Loading';
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
    const jwt = localStorage.getItem('_token');
    const userInformaiton = userInfo()

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filteredYear, setFilteredYear] = useState(new Date().getFullYear());

    const [holidayInput, setHolidayInput] = useState({
        holidayName: "",
        holidayDate: "",
        holidayEndDate: ""
    })
    const [holidayInfo, setHolidayInfo] = useState([])
    const [singleHolidayInfo, setSingleHolidayInfo] = useState({
        holidayName: "",
        holidayDate: ""
    })
    const [selectedDate, setSelectedDate] = useState({
        startDate: null,
        endDate: null
    })

    const [toggle, setToggle] = useState('')
    const [eidtId, setEditId] = useState('')


    // For Action icon open
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // For Action icon close
    const handleClose = () => {
        // setEditId("")
        setAnchorEl(null);
    };
    // For Modal open
    const handleClickOpen = () => {
        setOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setHolidayInput({
            holidayName: "",
            holidayDate: "",
            holidayEndDate: ""
        })
        setSelectedDate(null)
        setToggle('')
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
            <MenuItem onClick={() => {
                setToggle('Edit')
                handleClickOpen()
                handleClose()
                getSingleHoliday()
            }}>
                <Typography textAlign="center">Edit</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
                setToggle('Delete')
                deleteHoliday()
                handleClose()

            }}>
                <Typography textAlign="center">Delete</Typography>
            </MenuItem>
        </Menu>
    )
    const getSingleHoliday = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/holiday/getsingleholiday/${eidtId}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
        })
        const data = await res.json()
        if (res.status === 200) {
            setHolidayInput({
                holidayName: data[0].holidayName,
                holidayDate: data[0].date,
                holidayEndDate: data[0].endDate
            })
            // setSelectedDate(data[0].date)
            setLoading(false)
        } else {
            setLoading(false)
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    const updateHoliday = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/holiday/updatesingleholiday/${eidtId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify(holidayInput)
        })
        const data = await res.json()
        if (res.status === 200) {
            toast.success('Created Successfully', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            setHolidayInput({
                holidayName: "",
                holidayDate: "",
                holidayEndDate: ""
            })
            setSelectedDate(null)
            handleClickClose()
            setLoading(false)
            getAllHoliday(filteredYear)
        } else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            handleClickClose()
            setLoading(false)
        }
    }


    const deleteHoliday = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/holiday/deleteholiday/${eidtId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            credentials: 'include'
        })
        const data = await res.json()
        if (res.status === 200) {
            toast.success('Deleted Successfully', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            handleClose()
            setLoading(false)
            getAllHoliday(filteredYear)
            setEditId("")
        } else {
            toast.warning("Something Went wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            handleClose()
            setLoading(false)
            setEditId("")
        }
    }
    // Check if there is any null or empty string in create employee field 
    function isEmptyObject(o) {
        return Object.keys(o).some(function (x) {
            return o[x] === '' || o[x] === null;
        });
    }

    const createHoliday = async () => {
        if (isEmptyObject(holidayInput)) return toast.warning('Fill All the fields', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        setLoading(true)

        const res = await fetch(`${process.env.REACT_APP_URL}/holiday/createholiday`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify(holidayInput),
            credentials: 'include',
            // withCredentials: true
        })

        const data = await res.json()
        if (res.status === 201) {
            toast.success('Created Successfully', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            setHolidayInput({
                holidayName: "",
                holidayDate: "",
                holidayEndDate: ""
            })
            setSelectedDate(null)
            handleClickClose()
            setLoading(false)
            getAllHoliday(filteredYear)
        } else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            handleClickClose()
            setLoading(false)
        }
    }

    const formattedDate = (param) => {
        const date = new Date(param);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const convertedDate = date.toLocaleDateString('en-US', options);
        return convertedDate
    }

    const formattedDay = (param) => {
        const date = new Date(param);

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        return dayOfWeek
    }

    const getAllHoliday = async (year) => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/holiday/getallholiday?year=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
        })
        const data = await res.json()
        if (res.status === 200) {
            setLoading(false)
            setHolidayInfo(data)
        } else {
            setLoading(false)
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }

    }

    useEffect(() => {
        getAllHoliday(filteredYear)
    }, [])

    return (
        <>
            {loading ? <Loading /> : (
                <Box sx={{ marginLeft: { sm: '30px', md: "280px", xs: '30px' }, marginRight: "30px", maxWidth: '2618px' }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Holidays {filteredYear}</Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DemoContainer components={['DatePicker']} >
                                <DatePicker
                                    label="Select Year"
                                    openTo="year"
                                    value={selectedDate?.startDate}
                                    views={['year']}
                                    sx={{ width: 365, maxHeight: 345, }}
                                    onChange={(e) => {
                                        if (e?.['$y']) {
                                            setFilteredYear(e['$y'])
                                            getAllHoliday(e['$y'])
                                        }
                                    }} />
                            </DemoContainer>
                        </LocalizationProvider>

                        {userInformaiton.role.alias === "Admin" ? (

                            <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleClickOpen}>
                                Add Holiday
                            </Button>
                        ) : null}
                    </Box>
                    <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", minWidth: '600px', width: "82vw", marginBottom: "100px" }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell sx={{ fontWeight: "bold" }}>No</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: "bold" }}>Title</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: "bold" }}>Start Date</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: "bold" }}>End Date</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: "bold" }}>Start Day</StyledTableCell>
                                    {userInformaiton.role.alias === "Admin" ? <StyledTableCell sx={{ fontWeight: "bold" }}>Action</StyledTableCell> : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    holidayInfo.map((row, ind) => (
                                        <StyledTableRow
                                            key={row.name}
                                        >
                                            <StyledTableCell component="th" scope="row">
                                                {ind + 1}
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row">
                                                {row.holidayName}
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row">
                                                {formattedDate(row?.startDate)}
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row">
                                                {formattedDate(row?.endDate)}
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row">
                                                {formattedDay(row.date)}
                                            </StyledTableCell>

                                            {
                                                userInformaiton.role.alias === "Admin" ?
                                                    <StyledTableCell component="th" scope="row">
                                                        <>
                                                            <IconButton aria-label="settings" >
                                                                <MoreVertIcon onClick={(e) => {
                                                                    handleClick(e)
                                                                    setEditId(row._id)
                                                                }} />
                                                            </IconButton>
                                                            {menu}

                                                        </>
                                                    </StyledTableCell> :
                                                    null
                                            }
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
                            {toggle === 'Edit' ? 'Update Holiday' : 'Add Holiday'}
                        </BootstrapDialogTitle>
                        <DialogContent >
                            <TextField id="outlined-search" label="Holiday Name *" value={holidayInput.holidayName} type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 0px 0px" }} onChange={(e) => { setHolidayInput({ ...holidayInput, holidayName: e.target.value }) }} />
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DatePicker']} >
                                    <DatePicker label="From *" value={selectedDate?.startDate} sx={{ width: 365, maxHeight: 345, }} onChange={(e) => {
                                        if (e?.['$d']) {
                                            setHolidayInput({ ...holidayInput, holidayDate: e.$d })
                                            setSelectedDate({ ...selectedDate, startDate: e })
                                        }
                                    }} />
                                </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DatePicker']} >
                                    <DatePicker label="To *" value={selectedDate?.endDate} sx={{ width: 365, maxHeight: 345, }} onChange={(e) => {
                                        if (e?.['$d']) {
                                            setHolidayInput({ ...holidayInput, holidayEndDate: e.$d })
                                            setSelectedDate({ ...selectedDate, endDate: e })
                                        }
                                    }} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </DialogContent>
                        {
                            toggle === 'Edit' ?
                                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={updateHoliday}>
                                        Update
                                    </Button>
                                </DialogActions> :
                                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={createHoliday}>
                                        Submit
                                    </Button>
                                </DialogActions>
                        }
                    </BootstrapDialog>
                </Box>

            )}
        </>
    )
}

export default Holidays