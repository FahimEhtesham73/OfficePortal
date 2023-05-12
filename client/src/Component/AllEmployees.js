import React, { useEffect, useState } from 'react'
// Importing from MUI
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
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
import { toast } from 'react-toastify';
import Skeleton from '@mui/material/Skeleton';
import Cookies from 'js-cookie';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import userRole from './Hook/userHook';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';


// Modal Styling
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3)
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




const AllEmployees = () => {
  const jwt = Cookies.get('_token')

  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [department, setDepartment] = useState([])
  const [designation, setDesignation] = useState([])
  const [role, setRole] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [allUser, setAllUser] = useState([]);
  const [punchedInToday, setPunchedInToday] = useState({})
  const [user, setUser] = useState({
    firstName: "", lastName: "", email: "", password: "", designation: "", role: "", department: "", empId: "", joiningDate: ""
  })
  const [filterInfo, setFilterInfo] = useState({
    empName: "", userId: "", desgId: ""
  })
  const [menuItemUserId, setMenuItemUserId] = useState('')
  const navigate = useNavigate()

  let name
  let value

  const setUserInfo = (e) => {
    name = e.target.name
    value = e.target.value

    // console.log("Name: ",name,"value: ",value);
    setUser({ ...user, [name]: value })
  }

  let filterName
  let filterValue

  const setFilteredInputValue = (e) => {
    filterName = e.target.name
    filterValue = e.target.value
    setFilterInfo({ ...filterInfo, [filterName]: filterValue })
  }

  // console.log(user);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // For Modal open
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  // For Modal Close
  const handleModalClose = () => {
    setOpenModal(false);
  };
  const settings = ['View Profile'];

  const getAllDepartment = async () => {
    const res = await fetch(`${process.env.REACT_APP_URL}/depts/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      },
    })
    const data = await res.json()
    if (res.status === 200) {
      setDepartment(data.roles)
    } else {
      toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
    }

  }

  const getAllDesignations = async () => {
    const res = await fetch(`${process.env.REACT_APP_URL}/designations/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      },
    })
    const data = await res.json()
    // console.log("Designations", data);
    if (res.status === 200) {
      setDesignation(data.roles)
    } else {
      toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
    }

  }

  const getAllRoles = async () => {
    const res = await fetch(`${process.env.REACT_APP_URL}/roles/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      },
    })
    const data = await res.json()
    if (res.status === 200) {
      setRole(data.roles)
    } else {
      toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
    }

  }

  const getAllUser = async () => {
    setLoading(true)
    const res = await fetch(`${process.env.REACT_APP_URL}/users/getalluser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      },
    })
    const data = await res.json()
    // console.log("All User", data);
    if (res.status === 200) {
      setAllUser(data)
      setLoading(false)
    } else {
      setLoading(false)
      toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
    }

  }

  // Check if there is any null or empty string in create employee field 
  function isEmptyObject(o) {
    return Object.keys(o).some(function (x) {
      return o[x] === '' || o[x] === null;
    });
  }

  const createEmployee = async () => {
    if (isEmptyObject(user)) return toast.warning('Fill All the fields', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })

    const res = await fetch(`${process.env.REACT_APP_URL}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      },
      body: JSON.stringify(user),
      credentials: 'include',
      // withCredentials: true
    })

    const data = await res.json()
    if (res.status === 200) {
      toast.success('Employee Created Successfully', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
      setUser({
        firstName: "", lastName: "", email: "", password: "", designation: "", role: "", department: "", empId: "", joiningDate: ""
      })
      setSelectedDate(null)
      setOpenModal(false)
      getAllUser()
    } else {
      toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
      // setUser({
      //   firstName: "", lastName: "", email: "", password: "", designation: "", role: "", department: "", empId: "", joiningDate: ""
      // })
      setSelectedDate(null)
      // setOpenModal(false)
    }
  }


  const filterUser = async () => {
    if (filterInfo.desgId === 'All') {
      getAllUser()
    } else {
      setLoading(true)
      const res = await fetch(`${process.env.REACT_APP_URL}/users/searchuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwt
        },
        body: JSON.stringify(filterInfo),
        credentials: 'include',
      })

      const data = await res.json()
      console.log(data);
      if (res.status === 200) {
        setFilterInfo({
          desgId: "", empName: "", userId: ""
        })
        setAllUser(data)
        setLoading(false)
      } else if (res.status === 400) {
        setLoading(false)
        toast.warning('Invalid Input Value', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
      } else {
        setLoading(false)
        toast.warning(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
      }
    }
  }

  const todaysPunchInUsers = async()=> {
    const res = await fetch(`${process.env.REACT_APP_URL}/attendence/todayspunch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      },
    })
    const data = await res.json()
    console.log("today", data);
    if (res.status === 200) {
      setPunchedInToday(data?.data)
      setLoading(false)
    } else {
      setLoading(false)
      toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
    }
  }

  for(let p in punchedInToday){
    console.log(typeof p);
  }

  useEffect(() => {
    getAllUser()
    getAllDepartment()
    getAllDesignations()
    getAllRoles()
    todaysPunchInUsers()
  }, [])

  return (

    <>
      <Box sx={{ marginLeft: { sm: '30px', md: "280px", xs: '30px' }, marginRight: "30px" }}>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Employee</Typography>
          {userRole() === 'Admin' && <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleModalOpen}>
            Add Employee
          </Button>}
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "40px", maxWidth: "2618px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField id="outlined-search" label="Employee ID" type="search" sx={{ width: '100%' }} name='userId' value={filterInfo.userId} onChange={(e) => { setFilteredInputValue(e) }} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField id="outlined-search" label="Employee Name" type="search" sx={{ width: '100%' }} name='empName' value={filterInfo.empName} onChange={(e) => { setFilteredInputValue(e) }} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-label">Designation *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name='desgId'
                  value={filterInfo.desgId}
                  label="Select leave type"
                  onChange={(e) => {
                    setFilteredInputValue(e)
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {
                    designation && designation.map((des) => {
                      return (
                        <MenuItem value={des._id}>{des.name}</MenuItem>
                      )
                    })
                  }

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button variant="contained" sx={{ width: '100%', height: "55px" }} onClick={filterUser}>Search</Button>
            </Grid>
          </Grid>
        </Box>


        {/* All Employee List */}
        {
          loading ? <>

            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "40px", maxWidth: "2618px" }}>
              <Grid container spacing={3}>
                {
                  [0, 1, 2, 4].map((val, ind) => {
                    return (
                      <Grid item xs={12} sm={6} md={3}>
                        <Card elevation='4' sx={{ width: '100%', maxHeight: 345 }}>
                          <Skeleton variant="rectangular" width={'100%'} height={345} style={{ marginTop: "40px" }} />
                        </Card>
                      </Grid>
                    )
                  })
                }

              </Grid>

            </Box>
          </>

            :
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "40px", maxWidth: "2618px" }}>
              {/* {console.log("punch",JSON.parse(JSON.stringify(punchedInToday)))} */}
              <Grid container spacing={3}>
                {
                  allUser.map((val, ind) => {
                    let id = val?._id.toString();
                    // console.log("val", id);

                    // console.log(`hello: ${JSON.parse(JSON.stringify(punchedInToday))[id]}`);
                    return (
                      <Grid item xs={12} sm={6} md={3}>
                        <Card elevation='4' sx={{ width: '100%', maxHeight: 345 }} >
                          <CardHeader
                          avatar = {
                            // <Tooltip title= `${(punchedInToday?.[id]?.checkInTime ? "available": "away")}` >
                              <FiberManualRecordIcon titleAccess={`${(punchedInToday?.[id]?.checkInTime ? punchedInToday?.[id]?.checkOutTime ? "away" : "online" : "Not Present")}`} sx={{color: `${punchedInToday?.[id]?.checkInTime ? punchedInToday?.[id]?.checkOutTime? "#B2BEB5": "green" : "black"}`}} />

                            // </Tooltip>
                          }
                            action={
                              <IconButton aria-label="settings" onClick={(e) => {
                                handleClick(e)
                                setMenuItemUserId(val._id)
                              }}>
                                <MoreVertIcon />
                              </IconButton>
                            }
                          />
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
                              handleClose()
                              navigate(`/profile/${menuItemUserId}`)
                            }}>
                              <Typography textAlign="center" >View profile</Typography>
                            </MenuItem>
                          </Menu>

                          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                            <CardContent>
                              <Avatar alt='Employee' src={val.imagePath} sx={{ width: 120, height: 120 }} />
                            </CardContent>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val.firstName} {val.lastName}</Typography>
                            <Typography sx={{ fontSize: '13px' }}>{val?.designation?.name}</Typography>
                          </Box>
                        </Card>
                      </Grid>
                    )
                  })
                }

              </Grid>

            </Box>
        }

        {/* Modal */}
        <BootstrapDialog
          onClose={handleModalClose}
          aria-labelledby="customized-dialog-title"
          open={openModal}
        >
          <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleModalClose}>
            Create Employee
          </BootstrapDialogTitle>
          <DialogContent sx={{
            display: "flex", justifyContent: "center", flexDirection: "column",
            overflowY: "auto"
          }}>
            {/* First Name */}
            <TextField id="outlined-search" label="First Name " name='firstName' value={user.firstName} type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "0px 20px 10px 0px" }} onChange={(e) => { setUserInfo(e) }} required />
            {/* Last name */}
            <TextField id="outlined-search" label="Last Name *" name='lastName' value={user.lastName} type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "0px 20px 10px 0px" }} onChange={(e) => { setUserInfo(e) }} />
            {/* Email */}
            <TextField id="outlined-search" label="Email *" name='email' value={user.email} type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "0px 20px 10px 0px" }} onChange={(e) => { setUserInfo(e) }} />
            {/* Password */}
            <TextField id="outlined-search" label="Password *" name='password' value={user.password} type="text" sx={{ minWidth: 365, maxHeight: 345, margin: "0px 20px 10px 0px" }} onChange={(e) => { setUserInfo(e) }} />
            {/* Designation */}
            <Box sx={{ minWidth: 120 }}>

              <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 0px 0px 0px" }}>
                <InputLabel id="demo-simple-select-label">Designation *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name='designation'
                  value={user.designation}
                  label="Select leave type"
                  onChange={(e) => {
                    setUserInfo(e)
                  }}
                >
                  {
                    designation && designation.map((des) => {
                      return (
                        <MenuItem value={des._id}>{des.name}</MenuItem>
                      )
                    })
                  }

                </Select>
              </FormControl>
            </Box>
            {/* Current Role */}
            <Box sx={{ minWidth: 120 }}>

              <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 0px 0px 0px" }}>
                <InputLabel id="demo-simple-select-label">Current Role *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={user.role}
                  name='role'
                  label="Select leave type"
                  // onChange={handleChange}
                  onChange={(e) => {
                    setUserInfo(e)
                  }}
                >
                  {
                    role && role.map((role) => {
                      return (
                        <MenuItem value={role._id}>{role.alias}</MenuItem>
                      )
                    })
                  }

                </Select>
              </FormControl>
            </Box>
            {/* Department */}
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 0px 0px 0px" }}>
                <InputLabel id="demo-simple-select-label">Department *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name='department'
                  label="Select leave type"
                  value={user.department}
                  onChange={(e) => {
                    setUserInfo(e)
                  }}
                >
                  {
                    department && department.map((dept) => {
                      return (
                        <MenuItem value={dept._id}>{dept.alias}</MenuItem>
                      )
                    })
                  }

                </Select>
              </FormControl>
            </Box>
            {/* Employee ID */}
            <TextField id="outlined-search" label="Employee Id *" name='empId' value={user.empId} type="text" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 0px 0px" }} onChange={(e) => {
              setUserInfo(e)
            }} />

            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DemoContainer components={['DatePicker']} >
                <DatePicker label="From *" value={selectedDate} sx={{ width: 365, maxHeight: 345, }} onChange={(e, x) => {
                  // setUserInfo(e)
                  setUser({ ...user, joiningDate: e?.['$d'] ? e['$d'] : "" })
                  setSelectedDate(e)
                  console.log("date Change", e?.['$d'] ? e['$d'] : "");
                }} />
              </DemoContainer>
            </LocalizationProvider>

          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
              createEmployee()
            }}>
              Create
            </Button>
          </DialogActions>
        </BootstrapDialog>

      </Box>
    </>
  )
}

export default AllEmployees