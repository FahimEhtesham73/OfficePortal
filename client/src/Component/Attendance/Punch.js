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
import React, { useState } from 'react'
import Cookies from 'js-cookie';


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
    const classes = useStyles()
    function createData(name, date, punchin, punchout, totalhour, overtime) {
        return { name, date, punchin, punchout, totalhour, overtime };
    }
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState([])
    const [checkBoxDisableHome, setCheckBoxDisableHome] = useState(false)
    const [checkBoxDisableOffice, setCheckBoxDisableOffice] = useState(false)
    // For Modal open
    const handleClickOpen = () => {
        setOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setOpen(false);
    };

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
    

    const punchIn = async()=>{
        const res = await fetch(`${process.env.REACT_APP_URL}/attendance/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + jwt
              
            },
            body:JSON.stringify({
                checkInTime:new Date(),
                status:position
            }),
            credentials: 'include',
            // withCredentials: true
          })

        const data = await res.json()
        console.log("created punch data",data);
    }
    const rows = [
        createData('Saimom', "1 Jan 2023", '8:30 AM', '5:30 PM', '9 hrs', '0'),
        createData('Saimom', "1 Jan 2023", '8:30 AM', '6:00 PM', '9.5 hrs', '.5'),
        createData('Saimom', "1 Jan 2023", '8:30 AM', '5:30 PM', '9 hrs', '0'),
        createData('Saimom', "1 Jan 2023", '8:30 AM', '5:30 PM', '9 hrs', '0'),
        createData('Saimom', "1 Jan 2023", '8:30 AM', '6:30 PM', '10 hrs', '1'),
    ];
    return (
        <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px" }}>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Attendance</Typography>
            </Box>
            {/* Punch card Section */}
            <Box className={classes.cardWrapper}>
                <Card elevation={4} sx={{ width: '60%' }}>
                    <CardContent>
                        <Typography sx={{ fontWeight: 'bolder' }}>Time Sheet<span className={classes.timeColor}> 21 Mar,2023</span></Typography>
                        <Box className={classes.paperDesign}>
                            <Typography className='text-center'>Punched In at 8:30 A.M</Typography>
                        </Box>
                        {/* Hour Circle */}
                        <Box className={classes.circleWrapper}>
                            <Box className={classes.circle}>
                                <Typography variant="h6">3.05 hrs</Typography>
                            </Box>
                        </Box>
                        <Box className={classes.button}>
                            <Button variant="contained" onClick={handleClickOpen}>Punch In</Button>
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
                                <MenuItem value={10}>January</MenuItem>
                                <MenuItem value={20}>February</MenuItem>
                                <MenuItem value={30}>March</MenuItem>
                                <MenuItem value={10}>April</MenuItem>
                                <MenuItem value={20}>May</MenuItem>
                                <MenuItem value={30}>June</MenuItem>
                                <MenuItem value={10}>July</MenuItem>
                                <MenuItem value={20}>August</MenuItem>
                                <MenuItem value={30}>September</MenuItem>
                                <MenuItem value={10}>October</MenuItem>
                                <MenuItem value={20}>November</MenuItem>
                                <MenuItem value={30}>December</MenuItem>
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
                            rows.map((row, ind) => (
                                <StyledTableRow
                                    key={ind}
                                >
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.date}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.punchin}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.punchout}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.totalhour}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.overtime}
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
                        <FormControlLabel control={<Checkbox />} value='WH' label="Work On Holiday" />
                        <FormControlLabel control={<Checkbox />} value='HD' label="Half day" />
                    </FormGroup>

                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={()=>{handleClickClose()
                    punchIn()}}>
                        Punch
                    </Button>
                </DialogActions>
            </BootstrapDialog>

        </Box>
    )
}

export default Punch