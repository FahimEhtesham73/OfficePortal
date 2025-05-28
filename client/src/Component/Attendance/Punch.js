import { Box, Button, Card, CardContent, Paper, ToggleButton, Typography, Modal, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import SearchIcon from '@mui/icons-material/Search';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
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
import Autocomplete from '@mui/material/Autocomplete';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Loading from '../Hook/Loading/Loading';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import userRole from '../Hook/userHook';
import CheckIcon from '@mui/icons-material/Check';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { modifySingleAttendene } from '../../api/attendenceApi';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import SingleProject from '../Project/SingleProject';
import FileDownloadIcon from '@mui/icons-material/FileDownload'

import { useForm, Controller } from 'react-hook-form'
import { createProjectContribution, deleteProjectContribution, getProjectContributionSingleDay } from '../../api/contributionApi';
import { getAllHoildaysApi } from '../../api/holidayApi';
import useLogout from '../Hook/useLogout';

const useStyles = makeStyles((theme) => ({
    modalContent: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 1200,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: 24,
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        maxHeight: '700px',
        overflowY: 'auto',
        [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
            width: '100%'
        },

    },
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
    // '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.action.hover,
    // },
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

const Punch = ({ project }) => {
    const jwt = localStorage.getItem('_token')
    const jwtUser = localStorage.getItem('_info')

    const getUserIdFromJwt = (token) => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded._id;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    };

    const userId = getUserIdFromJwt(jwt);
    // console.log("user", userId);
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

    // console.log({decodedUser});
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
    const [filteredEmpId, setFilteredEmpId] = useState("")
    const [filteredDate, setFilteredDate] = useState('')
    const [totalWH, setTotalWH] = useState();
    const [totalWHM, setTotalWHM] = useState();
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [updateAttendence, setUpdateAttendence] = useState({});
    const [checkBoxHD, setCheckBoxHD] = useState(false)
    const [checkBoxWOH, setCheckBoxWOH] = useState(false)
    const [punchoutUpdate, setPunchutUpdate] = useState(false);
    const [endtimeChange, setEndDateTimeChanged] = useState(false);
    const [halfDayWarning, setHalfDayWarning] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [totalWorkingHours, setTotalWorkingHours] = useState('');
    const [projects, setProjects] = useState([]);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [projectWorkingHours, setProjectWorkingHours] = useState([]);
    const [projectSuggestions, setProjectSuggestions] = useState([]);
    const [clickedDate, setClickedDate] = useState("")
    const [clickedTotalHour, setClickedRTotalHour] = useState("")
    const [allHolidayDate, setAllHolidayDate] = useState([])
    const [clickedUserId, setClickedUserId] = useState("")
    const [attendanceData, setAttendanceData] = useState([])
    const [lateCount, setLateCount] = useState(null)

    const date = new Date()
    const [month, setMonth] = useState(date.getMonth() + 1)
    const [year, setYear] = useState(date.getFullYear())

    const { logout } = useLogout()

    const fetchProjectSuggestions = async (inputValue) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/subproject/searchProject/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch project suggestions');
            }
            const responseData = await response.json();
            // console.log({ responseData });
            // console.log('Fetched project suggestions:', responseData);

            // const suggestions = responseData.data.map(project => `${project.ProjectId}-${project.subProjectCode}`);
            // console.log("suggestions", suggestions);
            setProjectSuggestions(responseData.data);
        } catch (error) {
            console.error('Error fetching project suggestions:', error);
        }
    };

    useEffect(() => {
        fetchProjectSuggestions(searchValue);
    }, []);

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

    const handleModalOpen = (rowIndex, date, userId) => {
        setClickedDate(date)
        setCurrentRow(rowIndex);
        setOpenModal(true);
        setClickedUserId(userId)
    };

    const handleModalClose = () => {
        setClickedDate("")
        setOpenModal(false);
        setCurrentRow(null);
        setProjectWorkingHours([])
        setSearchValue('');
        setProjects([])
        setClickedRTotalHour("")
        setClickedUserId("")
    };


    const getAllHoilday = async () => {
        try {
            const respnse = await getAllHoildaysApi(jwt);
            // console.log(respnse);
            if (respnse.status === 200) {
                const allHolidayDate = [...respnse?.data?.map(v => getDatesBetween(v?.startDate, v?.endDate))]
                setAllHolidayDate(allHolidayDate.flat());
            } else if (respnse.status === 401) {
                toast.warning("Authorization Failed", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                logout()
            }
        } catch (e) {
            if (e.response.status === 401) {
                toast.warning("Authorization Failed", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                logout()
                throw new Error("Authorization Failed")
            } else {
                toast.warning("Something Went Wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            }
        }
    }

    function getDatesBetween(startDateStr, endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const dates = [];

        // Adjust for time zone differences
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        let currentDate = startDate;

        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    const shouldDifferentColorRowHoliday = (date) => {
        const dateString = new Date(date).toISOString().split('T')[0];
        return allHolidayDate.includes(dateString);
    }

    const shouldDifferentColorRowWeekend = (date) => {
        const dateString = new Date(date).toISOString().split('T')[0];
        return (new Date(date).getDay() === 6 || new Date(date).getDay() === 0);
    };

    const handleProjectSelection = (selectedProject) => {

        let matchedProjects = projects.filter((val) => val.mergedProjectCode === selectedProject.mergedProjectCode)
        if (matchedProjects.length < 1) {
            if (currentRow !== null) {
                setProjects(prevProjects => [...prevProjects, { ...selectedProject, contribution: "", date: "", newCreated: true }]);
                setSearchValue('');
                setIsTableVisible(true);
            }
        }
    };


    const handleDeleteProject = async (index, project) => {
        // console.log(project.newCreated);
        if (project.newCreated) {
            const updatedProjects = projects.filter((_, i) => i !== index);
            setProjects(updatedProjects);

            const updatedProjectWorkingHours = [...projectWorkingHours, { [project.subProjectCode]: project.contribution }];
            const mergedProjects = mergeObjectsWithDuplicateKeys(updatedProjectWorkingHours);
            mergedProjects.splice(index, 1)
            // console.log({ mergedProjects });
            setProjectWorkingHours(mergedProjects);

            const totalHours = calculateTotalWorkingHours(updatedProjects);
            setTotalWorkingHours(totalHours);
        } else {
            const data = {
                userId,
                subProjectCode: project.subProjectCode,
                date: clickedDate
            }
            try {
                const att = await deleteProjectContribution(data, jwt);
                if (att.status === 200) {
                    getContributionProjectData(userId, clickedDate)
                }
            } catch (err) {
                // console.log({ err });
                if (err.response.status === 400) {
                    // handleModalClose()
                    toast.warning(err.response.data.message || err.response.data.error, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                } else if (err.response.status === 404) {
                    // handleModalClose()
                    toast.warning(err.response.data.message || err.response.data.error, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                } else {
                    // handleModalClose()
                    toast.warning("Something went wrong!", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                }
            }
        }
    };

    const calculateTotalWorkingHours = () => {
        let totalMinutes = 0;
        for (const project in projectWorkingHours) {
            if (projectWorkingHours.hasOwnProperty(project)) {
                const workingHours = projectWorkingHours[project];
                let keyName = Object.keys(workingHours)[0]
                if (workingHours[keyName] !== null) {
                    const [hours, minutes] = workingHours[keyName].split(':').map(Number);
                    if (hours !== undefined && minutes !== undefined) {
                        totalMinutes += hours * 60 + minutes;
                    }
                    // totalMinutes += hours * 60 + minutes;
                }
            }
        }
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    };


    const handleSave = () => {
        createContributionProject()
        // handleModalClose();
    };

    const generateTimeSuggestions = () => {
        const suggestions = [];
        for (let i = 0; i < 24; i++) {
            suggestions.push(`${i < 10 ? '0' + i : i}:00`);
            suggestions.push(`${i < 10 ? '0' + i : i}:30`);
        }
        return suggestions;
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
        // console.log("hadnle position", e.target.value);
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
                if (e.target.value !== undefined) {
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
        setEndDateTime(a?.modifiedCheckOutTime ? a?.modifiedCheckOutTime : a.checkOutTime || a?.key)
        if (a?.checkOutTime || a?.modifiedCheckOutTime) { setPunchutUpdate(true); setEndDateTimeChanged(true) }
        setPosition(a?.status || [])

        // console.log("postion", position);
        // setPosition(a?.status);
        if (a?.status?.includes('WAO')) {
            setCheckBoxDisableOffice(true);
            setCheckBoxDisableHome(false)
            setPosition([...a?.status])

        }
        else if (a?.status?.includes('WFH')) {
            setCheckBoxDisableHome(true)
            setCheckBoxDisableOffice(false)
            //  setPosition([...a?.status])
        }
        if (a?.status?.includes("HD")) {
            setCheckBoxHD(true)
        }
        if (a?.status?.includes("WOH")) {
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
                toast.success("Punched In Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                const localTime = formatAMPM(new Date(data?.info?.checkInTime))
                setPunchedTime(localTime)
                setIsPunchedIn(true)
                // document.getElementById("time") && document.getElementById("time").innerText = `00:00`
                const timeElement = document.getElementById("time");
                if (timeElement) {
                    timeElement.innerText = `00:00`;
                }
                setPosition([])
                getInfo()
                getPunchedInfo()
                checkLateAttendance()
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
            // document.getElementById("time")?.innerText = ''
            const timeElement = document.getElementById("time");
            if (timeElement) {
                timeElement.innerText = ``;
            }
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
                modifiedCheckOutTime: endtimeChange ? endDateTime : ""

            }
            // console.log("data", data);
            // return;
            if (data.modifiedCheckOutTime && (new Date(data.modifiedCheckOutTime) < new Date(data.modifiedCheckInTime))) {

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

    const areAllPropertiesFilled = (arr) => {
        return arr.every(obj =>
            Object.values(obj).every(value => value !== '' && value !== null && value !== undefined)
        );
    };

    const createContributionProject = async () => {
        const data = {
            userId: clickedUserId,
            projects
        }

        try {
            const att = await createProjectContribution(data, jwt);
            // const responseData = await att.json()
            // console.log(att.status);
            if (att.status === 200) {
                // setProjects(att.data)
                handleModalClose()
                toast.success("Contribution Added Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                // console.log(att.data);
            }
        } catch (err) {
            setProjects([])
            if (err.response.status === 400) {
                // handleModalClose()
                toast.warning(err.response.data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            } else if (err.response.status === 404) {
                // handleModalClose()
                toast.warning(err.response.data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            } else {
                // handleModalClose()
                toast.warning("Something went wrong!", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            }


        }
    }

    const getContributionProjectData = async (userId, date) => {

        const data = {
            userId,
            date
        }
        try {
            const att = await getProjectContributionSingleDay(data, jwt);
            // const responseData = await att.json()
            // console.log(att.status);
            if (att.status === 200) {
                let recievedData = att.data
                // console.log({ recievedData });
                setProjects(att.data)
                let dataArr = []
                recievedData.forEach(val => {
                    // console.log({ val });
                    dataArr.push({ [val.subProjectCode]: val.contribution })
                });
                setProjectWorkingHours(dataArr);
            }
        } catch (err) {
            setProjects([])
            if (err.response.status === 400) {
                toast.warning(err.response.data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            } else if (err.response.status === 404) {
                // toast.warning(err.response.data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            } else {
                toast.warning("Something went wrong!", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            }


        }
    }

    const totalHour = (sDate, eDate) => {
        const diffInMilliseconds = Math.abs(eDate - sDate);
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

        const hour = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        const minuteValuInStr = minutes < 10 ? `0${minutes}` : minutes
        // console.log({hour},{minuteValuInStr});
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

    };

    function formatHoursAndMinutes(hours) {

        const givnHours = Math.floor(hours);

        const minutes = Math.round((hours - givnHours) * 60);

        const formattedHours = givnHours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;

    }

    const overTime = (sDate, eDate) => {

        let time = eDate - sDate
        const timeDifferenceInHours = time / (60 * 60 * 1000);

        // console.log("timeDuff",timeDifferenceInHours);
        if (timeDifferenceInHours > 9) {
            // Calculate extra hours
            const extraHours = timeDifferenceInHours - 9;
            // return extraHours.toFixed(2)
            return formatHoursAndMinutes(extraHours);

        } else {
            return "00:00";
        }

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

        // document.getElementById("time")?.innerText = `${hoursText} : ${minutesText}`
        const timeElement = document.getElementById("time");
        if (timeElement) {
            timeElement.innerText = `${hoursText} : ${minutesText}`;
        }

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
            setTotalWHM(data?.toatlWorkingHoursThisMonth)
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
            setAllUser(data.data[0]?.result)
            setLoading(false)
        } else {
            setLoading(false)
            // toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }

    }

    const fetchIndividualAttendance = async () => {
        // console.log({ filteredId }, { filteredDate });
        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/getall`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({
                "userId": filteredId,
                "monthDateYear": filteredDate === '' ? new Date() : filteredDate
            }),
            credentials: 'include',
            withCredentials: true
        })

        const data = await res.json()
        // console.log("Fetch Individual", data);

        if (res.status === 200) {
            checkLateAttendance()
            setAttendenceList(data.attendenceList);
            // console.log(data.attendenceList);
            setTotalWH(data?.totalHours)
            setTotalWHM(data?.toatlWorkingHoursThisMonth)
        } else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    const checkLateAttendance = async () => {
        setLoading(true)
        const userId = filteredEmpId !== '' ? filteredId : decodedUser._id;
        const res = await fetch(`${process.env.REACT_APP_URL}/users/sendmail/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({
                "month": filteredDate === '' ? new Date() : filteredDate
            }),
            credentials: 'include',
            withCredentials: true
        })

        const data = await res.json()
        // console.log(" Table Data", data);
        if (res.status === 200) {
            setLoading(false)
            setLateCount(data.lateCount)
        } else {
            setLoading(false)
            if (data.latecount) {
                setLateCount(data.lateCount)
            }
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    function checkinHalfDay(startDate, endDate, halfday, endateTimechange) {
        // console.log("hello", startDate, endDate, halfday);
        // console.log("start", startDateTime);
        // console.log("end", endDateTime);

        // console.log("is greater than 4.5hr",new Date(endDateTime).getTime() - new Date(startDateTime).getTime() > 16200000);
        let greaterThenMax = new Date(endDate).getTime() - new Date(startDateTime).getTime()
        // console.log(greaterThenMax);
        if (startDateTime && endDateTime && halfday && greaterThenMax > 16200000) {
            // console.log("yeee");
            setHalfDayWarning(true)
        } else {
            setHalfDayWarning(false)
        }
    }

    const integrateMachineData = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/upadateFromMachine`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({
                "employeeId": filteredEmpId === '' ? decodedUser.empId : filteredEmpId,
                "date": filteredDate === '' ? new Date() : filteredDate
            }),
            credentials: 'include',
            withCredentials: true
        })

        const data = await res.json()
        // console.log(" Table Data", data);
        if (res.status === 200) {
            fetchIndividualAttendance()
            toast.success('attendence updated successfully', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            setLoading(false)

        } else {
            setLoading(false)
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    const { control, watch, setValue, trigger } = useForm();
    const watchTime = watch('time');

    const validateTime = (value) => {
        const [hours, minutes] = value.split(':').map(Number);
        return (
            hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
        ) || 'Invalid time format';
    };

    const timeSuggestions = generateTimeSuggestions();

    const mergeObjectsWithDuplicateKeys = (arr) => {
        const result = {};

        for (const obj of arr) {
            const [key, value] = Object.entries(obj)[0]; // Destructure the first key-value pair
            result[key] = value; // Update or add the key-value pair
        }

        // Convert the result object back to an array of objects
        return Object.entries(result).map(([key, value]) => ({ [key]: value }));
    };

    const updateProjectState = (project, contribution) => {
        // console.log({projectWorkingHours});
        const updatedProjectWorkingHours = [...projectWorkingHours, { [project.subProjectCode]: contribution }];
        const mergedProjects = mergeObjectsWithDuplicateKeys(updatedProjectWorkingHours);
        // console.log({ mergedProjects });
        setProjectWorkingHours(mergedProjects);

        project = { ...project, contribution, date: clickedDate }
        let updatedProject = projects.map((val) => val.subProjectCode !== project.subProjectCode ? val : project)
        setProjects(updatedProject)
    };

    const getAttendanceSheet = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/attendence/singleuserattendence`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({ searchingDate: filteredDate, userId: filteredId || decodedUser._id }),
        })

        const data = await res.json()
        // console.log("attendence date", data);
        if (res.status === 200) {
            setAttendanceData(data)
            // setAllData(data)
            setLoading(false)
        }
        else {
            toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkTimeValidity = async () => {
            const isValid = await trigger('time');
            if (isValid) {
                // console.log("Valid time:", watchTime);

                // Call your save function here
            }
        };

        if (watchTime) {
            checkTimeValidity();
        }
    }, [watchTime, trigger]);

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

    const getWeekdayName = (date) => {
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return weekdays[date.getDay()];
    };

    const generateExcelData = (data) => {
        //work from home count day

        const totalHWCount = data[0]?.attendance.reduce((acc, curr) => {
            if (curr.aId.includes("WFH")) {
                acc += 1;
            }
            return acc
        }, 0);

        const monthHeader = ['Month', date.toLocaleString('default', {
            month: 'long'
        })]

        const header = data.length < 1 ? [] : ["User", ...data[0].attendance.map((day) => `Day ${day.day}/ ${getWeekdayName(new Date(`${year}/${month}/${day.day}`))}`)];

        const rows = data.map((user) => {
            const userRow = [user.user];
            user.attendance.forEach((day) => {
                if (day.present) {
                    const aIdString = day.aId.length > 0 ? day.aId.join("<br>") : "";
                    const checkInTime = (day.modifiedCheckIn === "" || day.modifiedCheckIn === "Unspecified") ? formatAMPM(new Date(day.checkIn)) : formatAMPM(new Date(day.modifiedCheckIn))
                    userRow.push(`Present<br>${aIdString}<br>${checkInTime}`);
                } else {
                    userRow.push("Absent");
                }
            });
            return userRow;
        });

        rows.push(["Total Home Office", totalHWCount]);
        rows.push(["Total delay day count", lateCount]);
        rows.push(['Total delay', parseInt(totalWH) > parseInt(totalHWCount) ? `${parseFloat(totalWH - totalWHM).toFixed(2)}` : `${parseFloat(totalWHM - totalWH).toFixed(2)}`, "if (-): need to work"]);
        rows.push(["Total worked hours", totalWH])
        rows.push(["Total working hours", totalWHM])

        return [header, ...rows,];
    }

    const handleDownload = () => {
        const data = generateExcelData(attendanceData);

        let worksheet = "<table>";
        worksheet += "<tr>"
        worksheet += `<td>Month</td>`;
        worksheet += `<td>${filteredDate ? filteredDate.toLocaleString('default', {
            month: 'long'
        }) : new Date().toLocaleString('default', {
            month: 'long'
        })}</td>`;
        worksheet += "</tr>";
        data.forEach((row) => {
            worksheet += "<tr>";
            row.forEach((cell) => {
                worksheet += `<td>${cell}</td>`;
            });
            worksheet += "</tr>";
        });
        worksheet += "</table>";

        const excelData =
            "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8," +
            encodeURIComponent(
                `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
               <head>
                   <!--[if gte mso 9]>
                   <xml>
                       <x:ExcelWorkbook>
                           <x:ExcelWorksheets>
                               <x:ExcelWorksheet>
                                   <x:Name>Attendance</x:Name>
                                   <x:WorksheetOptions>
                                       <x:DisplayGridlines/>
                                   </x:WorksheetOptions>
                               </x:ExcelWorksheet>
                           </x:ExcelWorksheets>
                       </x:ExcelWorkbook>
                   </xml>
                   <![endif]-->
               </head>
               <body>
                   ${worksheet}
               </body>
           </html>`
            );

        const anchor = document.createElement("a");
        anchor.href = excelData;
        anchor.download = `attendance_${year}_${month}.xls`;
        anchor.click();
    };

    useEffect(() => {
        const apiPromise = new Promise((resolve, reject) => {
            resolve(getAllHoilday())
        })

        apiPromise.then(() => {
            if (localStorage.getItem('_token') !== undefined) {
                getInfo();
                getPunchedInfo();
                getAttendanceSheet();

                if (userRole() === "Admin" || userRole() === "Project Lead" || userRole() === "Team Lead") {
                    getAllUser();
                }
            }
        }).catch(error => {
            // Handle any errors if needed
            console.error("Error in processing holiday data", error);
        });
        checkLateAttendance()
        // console.log({ jwt });
        // if (jwt) {
        //     getInfo()
        //     getPunchedInfo()
        //     getAttendanceSheet()
        //     if (userRole() === "Admin" || userRole() === "Project Lead" || userRole() === "Team Lead") {
        //         getAllUser()
        //     }
        // }
    }, [])

    useLayoutEffect(() => {

        if (punchedInfo?.checkInTime && !punchedInfo?.checkOutTime) {
            updateTime()
            // console.log("Another Effect",punchedInfo?.checkInTime,hoursText,minutesText);

            // document.getElementById("time")?.innerText = `${hoursText?.toString()?.padStart(2, "0")} : ${minutesText?.toString()?.padStart(2, "0")}`
            const timeElement = document.getElementById("time");
            if (timeElement) {
                timeElement.innerText = `${hoursText?.toString()?.padStart(2, "0")} : ${minutesText?.toString()?.padStart(2, "0")}`;
            }

        }

    }, [punchedInfo])

    return (
        <>
            {
                loading ?
                    <Loading /> :
                    <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px", maxWidth: '2618px' }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Attendance</Typography>
                        </Box>
                        {/* Punch card Section */}
                        <Box className={classes.cardWrapper}>
                            <Card elevation={4} sx={{ width: { sm: '90%', md: '80%', xs: '100%' } }}>
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
                                            isPunchedIn ? <Button variant="contained" onClick={() => { punchOut() }}>Punch Out</Button> : <Button variant="contained" disabled={punchedInfo ? true : false} onClick={handleClickOpen}>Punch In</Button>
                                        }
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                        <Box sx={{ width: { sm: '90%', md: '80%', xs: '100%' }, margin: "10px auto", display: "flex", flexWrap: "wrap" }}>
                            <Card elevation='4' sx={{ maxHeight: 345, padding: "10px 0px 10px 0px", width: "50%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Total Worked Hours</Typography>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{totalWH}</Typography>
                                </Box>
                            </Card>
                            <Card elevation='4' sx={{ maxHeight: 345, padding: "10px 0px 10px 0px", width: "50%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Total Working Hours</Typography>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{totalWHM}</Typography>
                                </Box>
                            </Card>
                        </Box>
                        {/*Attendance machine API get search box */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button variant="contained" sx={{ height: '55px', maxHeight: 200, width: '30%' }} onClick={integrateMachineData}>Get Attendance</Button>
                            <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ height: '55px', maxHeight: 200, width: '30%' }} onClick={handleDownload}>
                                Download Attendance
                            </Button>
                        </Box>
                        {/* <Box sx={{ marginTop: { xs: "40px" }, display: "flex", justifyContent: "end" }}>
                                    <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ width: 200, height: 55, }} >
                                        Download Attendance
                                    </Button>
                                </Box> */}

                        {/* Searching Div */}

                        <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px", maxWidth: '2618px', width: "100%" }}>
                            <Grid container spacing={3}>
                                {(userRole() === 'Admin' || userRole() === "Project Lead" || userRole() === "Team Lead") && <Grid item xs={12} sm={6} md={4} >
                                    <FormControl sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-label">Select Employee</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            // value={age}
                                            label="Age"
                                            onChange={(e) => {
                                                // console.log(e);
                                                let uniqueEmpId = e.target.value.split('-')[0]
                                                let empId = e.target.value.split('-')[1]
                                                setFilteredId(uniqueEmpId)
                                                setFilteredEmpId(empId)
                                            }}
                                        >
                                            <MenuItem value={`${decodedUser?._id}-${decodedUser?.empId}`}>{decodedUser?.firstName}</MenuItem>
                                            {
                                                allUser && allUser.map((val, ind) => {
                                                    return (
                                                        (val?.isActive === true || val?.isActive === undefined) && <MenuItem value={`${val._id}-${val.empId}`} >{val.firstName}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>}
                                {/* Select Month And Year*/}
                                <Grid item xs={12} sm={6} md={4} >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label={'Select Month and Year'} views={['month', 'year']} onChange={(e) => {
                                            if (e?.['$d']) searchedDate(e['$d'])
                                            setMonth(e?.$M + 1)
                                            setYear(e?.$y)
                                        }} sx={{ maxHeight: 200, width: '100%' }} />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} >
                                    <Button variant="contained" sx={{ height: '55px', maxHeight: 200, width: '100%' }} onClick={() => {
                                        fetchIndividualAttendance()
                                        getAttendanceSheet()
                                    }}>Search</Button>
                                </Grid>
                            </Grid>
                        </Box>
                        {/* } */}

                        <Grid container xs={12} sm={12} md={12}>

                            <TableContainer elevation={3} component={Paper} sx={{ marginTop: "30px", marginBottom: "30px", maxWidth: '2618px' }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell sx={{ fontWeight: "bold" }}>Name</StyledTableCell>
                                            <StyledTableCell sx={{ fontWeight: "bold" }}>Date</StyledTableCell>
                                            <StyledTableCell sx={{ fontWeight: "bold" }}>Punch In</StyledTableCell>
                                            <StyledTableCell sx={{ fontWeight: "bold" }}>Punch Out</StyledTableCell>
                                            <StyledTableCell sx={{ fontWeight: "bold" }}>Total Hour</StyledTableCell>
                                            <StyledTableCell sx={{ fontWeight: "bold" }}>Overtime</StyledTableCell>
                                            {attendenceList[0]?.userId === userId ? <StyledTableCell sx={{ fontWeight: "bold" }}>Assigned Project</StyledTableCell> : null}
                                            <StyledTableCell sx={{ fontWeight: "bold" }}>Actions</StyledTableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            attendenceList.map((row, ind) => (
                                                <StyledTableRow
                                                    key={ind}
                                                    style={{ backgroundColor: shouldDifferentColorRowWeekend(row?.key) ? "rgb(239, 250, 255, .7)" : shouldDifferentColorRowHoliday(row?.key) ? "rgb(255, 238, 238, .5)" : "" }}
                                                >
                                                    <StyledTableCell component="th" scope="row">
                                                        {row?.name}
                                                    </StyledTableCell>

                                                    <StyledTableCell component="th" scope="row">
                                                        {row?.key}
                                                    </StyledTableCell>

                                                    <StyledTableCell component="th" scope="row" style={{}} >
                                                        {row?.modifiedCheckInTime === row?.checkInTime ?
                                                            <>
                                                                {row?.checkInTime ? formatAMPM(new Date(row?.checkInTime)) : ""}

                                                            </> : <>
                                                                {row?.modifiedCheckInTime && <>  {formatAMPM(new Date(row?.modifiedCheckInTime))} <span style={{ color: "grey" }}>(Edited)</span> </>
                                                                }
                                                                {row?.checkInTime ? (<> <br /> {formatAMPM(new Date(row?.checkInTime))} </>) : ""}

                                                            </>}
                                                        {/* {row?.modifiedCheckInTime && (<Tooltip title="edited">
                                            <PriorityHighIcon sx={{ color: "red" }} />
                                        </Tooltip>)} */}

                                                    </StyledTableCell>

                                                    <StyledTableCell component="th" scope="row" style={{}}>
                                                        {row?.modifiedCheckOutTime === row?.checkOutTime ? <>
                                                            {row?.checkOutTime ? formatAMPM(new Date(row?.checkOutTime)) : ""}

                                                        </> : <>
                                                            {row?.modifiedCheckOutTime && <>  {formatAMPM(new Date(row?.modifiedCheckOutTime))} <span style={{ color: "grey" }}>(Edited)</span> </>}
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
                                                    {/* Assigned Project JSX */}
                                                    <StyledTableCell component="th" scope="row">
                                                        {
                                                            row?.userId === userId ? (
                                                                <IconButton onClick={() => {
                                                                    handleModalOpen(ind, row?.key, row?.userId)
                                                                    getContributionProjectData(row?.userId, row?.key)
                                                                    if (row.modifiedCheckInTime || row.checkInTime) {
                                                                        setClickedRTotalHour(totalHour(new Date(row?.modifiedCheckInTime || row?.checkInTime).getTime(), (row?.modifiedCheckOutTime || row?.checkOutTime) ? new Date(row?.modifiedCheckOutTime || row?.checkOutTime).getTime() : new Date()))
                                                                    } else {
                                                                        setClickedRTotalHour("Absent")
                                                                    }

                                                                }
                                                                }>
                                                                    <AddIcon />
                                                                </IconButton>
                                                            ) : null
                                                        }

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
                        </Grid>


                        {/* Contribution Add Modal */}
                        <Modal
                            open={openModal}
                            onClose={handleModalClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box className={classes.modalContent}>
                                <Grid container spacing={2}>
                                    <div style={{ fontWeight: 'bold', marginLeft: "12px" }}>Total Working Hours: {clickedTotalHour}</div>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 'bold' }}>Project Contribution Hours: {calculateTotalWorkingHours()}</div>
                                        <div style={{ fontWeight: 'bold' }}>Date: {clickedDate}</div>
                                    </Grid>
                                    <Grid item xs={12} md={8} lg={9}>
                                        <Autocomplete
                                            freeSolo
                                            options={projectSuggestions}
                                            getOptionLabel={(option) => option.mergedProjectCode}
                                            inputValue={searchValue || ''}
                                            onInputChange={(event, newInputValue) => {
                                                setSearchValue(newInputValue);
                                            }}
                                            onChange={(event, newValue) => {
                                                if (newValue && newValue.currentlyActive === true) {
                                                    toast.warning("This Project is Locked, you can not add contribution", {
                                                        position: toast.POSITION.TOP_CENTER,
                                                        autoClose: 2000,
                                                        pauseOnHover: false,
                                                    })
                                                }
                                                else {
                                                    // console.log('Selected Project:', newValue);
                                                    newValue && handleProjectSelection(newValue);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Add Project"
                                                    variant="outlined"
                                                    fullWidth
                                                    helperText="Select or enter project name"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {(
                                        <Grid item xs={12}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>Enrolled Project</StyledTableCell>
                                                        <StyledTableCell>Working Hour</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {projects.length > 0 && projects.map((project, index) => {
                                                        // console.log("project jsx", project);
                                                        return (
                                                            <StyledTableRow key={index}>
                                                                <StyledTableCell>
                                                                    {`${project.projectCode}-${project.subProjectCode}`}
                                                                </StyledTableCell>
                                                                <StyledTableCell>
                                                                    <Controller
                                                                        name={`time-${index}`}
                                                                        control={control}
                                                                        defaultValue={project.contribution || ''}
                                                                        render={({ field, fieldState }) => {
                                                                            // console.log(field.value);
                                                                            return (

                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    options={timeSuggestions}
                                                                                    inputValue={project.contribution ? project.contribution : ""}
                                                                                    onInputChange={(event, newValue) => {
                                                                                        field.onChange(newValue);
                                                                                        updateProjectState(project, newValue);
                                                                                    }}
                                                                                    onChange={(event, newValue) => {
                                                                                        field.onChange(newValue);
                                                                                        updateProjectState(project, newValue);
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            label="Time"
                                                                                            placeholder="HH:MM"
                                                                                            error={!!fieldState.error}
                                                                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            )
                                                                        }}
                                                                        rules={{ validate: validateTime }}
                                                                    />
                                                                </StyledTableCell>
                                                                <StyledTableCell>
                                                                    <IconButton onClick={() => handleDeleteProject(index, project)}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </StyledTableCell>

                                                            </StyledTableRow>
                                                        )
                                                    }
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Grid>

                                    )}
                                    <Grid item xs={12} sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginTop: 2
                                    }}>
                                        <Button onClick={handleModalClose} sx={{ marginRight: 1 }}>Cancel</Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSave}
                                            disabled={!areAllPropertiesFilled(projects)}
                                        >Save</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Modal>

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
                                                if (e?.['$d']) {
                                                    let customizeDateTime = new Date(startDateTime);
                                                    const extractTime = new Date(e["$d"])?.toTimeString();
                                                    const splitinngTime = extractTime.split(" ")[0].split(":");
                                                    customizeDateTime.setHours(splitinngTime[0])
                                                    customizeDateTime.setMinutes(splitinngTime[1])

                                                    setStartDateTime(customizeDateTime)
                                                    // handleTimeChange("05/01/2023")

                                                }
                                            }}



                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                                {/* <Box sx={{display: "flex", justifyContent: "space-between", alignItems:"center"}}> */}
                                {(punchoutUpdate || updateAttendence?.checkOutTime) ? (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={["TimePicker"]} >
                                            <TimePicker
                                                disableFuture
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
                                                    if (e?.['$d']) {
                                                        setEndDateTimeChanged(true);

                                                        let customizeDateTime = new Date(typeof endDateTime !== 'string' ? updateAttendence.key : endDateTime);
                                                        // console.log("end time", typeof endDateTime);

                                                        const extractTime = new Date(e["$d"])?.toTimeString();
                                                        const splitinngTime = extractTime.split(" ")[0].split(":");
                                                        customizeDateTime.setHours(splitinngTime[0])
                                                        customizeDateTime.setMinutes(splitinngTime[1])

                                                        setEndDateTime(customizeDateTime)

                                                        checkinHalfDay(startDateTime, customizeDateTime, checkBoxHD)
                                                    }


                                                }}

                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>

                                ) : ""}
                                {(!updateAttendence?.checkOutTime) && (

                                    !punchoutUpdate ? (
                                        <span onClick={(e) => {
                                            setPunchutUpdate(!punchoutUpdate)
                                            checkinHalfDay(startDateTime, endDateTime, checkBoxHD, true)


                                        }} style={{ textDecoration: "underline", cursor: "pointer", color: "black" }} >Want to update punch out time?</span>

                                    ) : (
                                        <span onClick={(e) => {
                                            setPunchutUpdate(!punchoutUpdate)
                                            setEndDateTimeChanged(false)
                                            // checkinHalfDay(startDateTime, endDateTime, checkBoxHD, false)
                                            setHalfDayWarning(false)

                                        }} style={{ textDecoration: "underline", cursor: "pointer", color: "rebeccapurple" }} >Not want to update punch out time?</span>

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
                                {halfDayWarning ? <>
                                    <br />
                                    <span title='you are selecting more than 4.5 hours' style={{ color: "orange" }}>Half day !</span>

                                </>
                                    : null}
                                <FormGroup sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 40px 0px" }} onClick={(e) => { handlePosition(e) }}>
                                    <FormControlLabel control={<Checkbox />} value='WFH' checked={checkBoxDisableHome} label="Work From Home" />
                                    <FormControlLabel control={<Checkbox />} value='WAO' checked={checkBoxDisableOffice} label="Work At Office" />
                                    <FormControlLabel control={<Checkbox />} value='WOH' checked={checkBoxWOH} onChange={(e) => setCheckBoxWOH(e.target.checked)} label="Work On Holiday" />

                                    <FormControlLabel control={<Checkbox />} checked={checkBoxHD} onChange={(e) => {
                                        setCheckBoxHD(e.target.checked)
                                        checkinHalfDay(startDateTime, endDateTime, e.target.checked)
                                    }
                                    } value='HD' label="Half day" />

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
            }
        </>

    )
}

export default Punch