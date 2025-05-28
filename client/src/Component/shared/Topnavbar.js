import React, { useState, useEffect } from 'react'
import { useAsyncError, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode';
// Importing from MUI
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import GridOnIcon from '@mui/icons-material/GridOn';
import BallotIcon from '@mui/icons-material/Ballot';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import LoginIcon from '@mui/icons-material/Login';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

// Importing Component
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import userRole from '../Hook/userHook';
import { profileImg } from '../functions/commonFunc';
import userInfo from '../Hook/useUseInfo';
import { getSingleUser, passwordChangeApi } from '../../api/userApi';
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, Modal, OutlinedInput, Popover, TextField } from '@mui/material';
import { toast } from 'react-toastify';

// Modal Styling
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
    overflowY: 'revert',
    marginTop: '20px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    overflowY: 'revert',
    marginTop: '20px'
  },
}));

const style = {
  p: 2,
  bgcolor: 'background.paper',
  boxShadow: 3,
  borderRadius: 1,
};


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


const drawerWidth = 240;
const settings = ['Profile', 'Settings', 'Logout'];


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Topnavbar = (props) => {

  const navigate = useNavigate()
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const profileInfo = userInfo();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openLeave, setOpenLeave] = useState(false)
  const [width, setWidth] = useState(window.innerWidth);
  const [profileImagePath, setProfileImagePath] = useState();
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notes: ""
  })

  const [anchorElManual, setAnchorElManual] = useState(null);

  const handleOpen = (event) => setAnchorElManual(event.currentTarget);
  const handleClose = () => setAnchorElManual(null);

  const openManual = Boolean(anchorElManual);

  const [showPassword, setShowPassword] = useState({

    currentPassword: false,
    newPassword: false,
    confirmPassword: false,

  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const token = localStorage.getItem('_info');
  const jwtToken = localStorage.getItem('_token')
  // console.log(token);

  const [openModalP, setOpenModalP] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  let decode = ''
  if (token) {
    decode = jwtDecode(token)
  } else {
    decode = ''
  }
  const [openList, setOpenList] = useState(false)

  function handleClickList() {
    setOpenList(!openList)
  }
  const id = decode?._id
  // For handling Drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpenLeave(!openLeave);
  };
  // console.log("profile", profileInfo);

  // For Profile Settings
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const saveMenuData = (text) => {
    navigate(`/${text}`)
  }

  const handleSpaceKeyPress = (event) => {
    if (event.key === ' ') {
      event.preventDefault(); // Prevent default space bar behavior
    }
  };

  const handleClosePass = () => {
    // setAnchorEl(null);
    setOpenModalP(false)
    setPasswordChange({
      passwordChange,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      notes: ""
    })
    setShowPassword({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    })
  };

  // For Modal open
  const handleModalOpenPass = () => {
    setOpenModalP(true);
  };

  const passwordChangeOp = async () => {
    if (passwordChange.confirmPassword !== passwordChange.newPassword) {
      setPasswordChange({ ...passwordChange, notes: "Password not matched." })
      return;
    }

    if (passwordChange.newPassword === passwordChange.currentPassword) {
      setPasswordChange({ ...passwordChange, notes: "Current and new password are same." })
      return;
    }

    if (passwordChange.newPassword.length <= 7) {
      setPasswordChange({ ...passwordChange, notes: "Need 8 characters or greater" })
      return;

    }

    if (passwordChange.currentPassword && passwordChange.newPassword && passwordChange.confirmPassword) {
      // return;
      const response = await passwordChangeApi({ userId: profileInfo._id, currentPassword: passwordChange.currentPassword, newPassword: passwordChange.newPassword }, jwtToken);
      const responseData = await response.json();
      if (response.status === 200) {
        toast.success("Password Changed Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        handleClosePass()
        return;
      } else {
        toast.warning(responseData?.errors || "Something went wrong, try again", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })

      }

    }
  }

  const loginUser = () => {
    getSingleUser(profileInfo?._id, jwtToken).then(d => {
      // console.log(d.status);
      // if(d.status === 401){
      //   toast.warning("Authorization Failed", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
      //   return;
      // }
      setProfileImagePath(d?.data[0]?.imagePath)
    }).catch(e => {
      // console.log(e.response.status);
      if(e.response.status === 401){
        toast.warning("Authorization Failed", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
      } else{
        toast.warning("Something Went Wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
      }
    })
  }

  useEffect(() => {
    if(jwtToken){
      loginUser()
    }
  }, [jwtToken])

  const drawer = (
    <div>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {
          !localStorage.getItem('_info') ?
            <>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => { saveMenuData('signin') }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Sign In'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
              {/* <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={(e) => { handleOpen(e) }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <StickyNote2Icon />
                  </ListItemIcon>
                  <ListItemText primary={'User Access'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem> */}
            </>
            :
            (
              <>
                {/* Punch IN */}
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => { saveMenuData('') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <PunchClockIcon />
                    </ListItemIcon>
                    <ListItemText primary={'In And Out'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                {/* All EMployee */}

                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => { saveMenuData('allemployee') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary={'All Employee'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                {/* Attendance Sheet */}
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => { saveMenuData('attendance') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <GridOnIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Attendance Sheet'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                {/* Holidays */}

                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => { saveMenuData('holiday') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <HolidayVillageIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Holidays'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                {/* Leave Employee */}
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => { saveMenuData('leaveemployee') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <EmojiTransportationIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Leaves'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>

                {/* Leave Status Admin */}

                {
                  (userRole() === 'Admin' || userRole() === 'Team Lead' || userRole() === "Project Lead") &&
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                      onClick={() => { saveMenuData('leaveadmin') }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <BallotIcon />
                      </ListItemIcon>
                      <ListItemText primary={'Leave Status'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                }
                {/* Team Lead */}

                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => { saveMenuData('projects') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <AccountTreeIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Projects'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                {/* Knowledge Sharing */}
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => { saveMenuData('knowledge_shareing') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary={'knowledge Sharing'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem> 
                {/* Planner */}
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => { saveMenuData('Planner') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <NextPlanIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Planner'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                {/* Evalution */}
                {/* <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={handleClickList}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <ArchitectureIcon />
                    </ListItemIcon>
                    <ListItemText primary="Project SnapShot" />
                    {openList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>
                  <Collapse in={openList} timeout="auto" unmountOnExit>
                    <Divider />
                    <List component="div" disablePadding>
                      <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText primary="Create SnapShot" onClick={() => { navigate('/create-snap') }}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText primary="SnapShot Dashboard" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText primary="Team Pulse Reporting" />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Collapse>
                </ListItem> */}
              </>

            )
        }

      </List>
    </div>
  )

  useEffect(() => {
    // Tracking Browser Width
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
    if (width >= 900) {
      setOpen(true)
    }
    return () => window.removeEventListener("resize", () => {
      setWidth(window.innerWidth)
    })

  }, [width])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: "100%" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => { width < 900 && setOpen(!open) }}
            edge="start"
          >
            {width < 900 && <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            NSL Portal
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {
            localStorage.getItem('_info') ?
              <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                <Typography variant="p" component="div" sx={{ marginRight: "15px" }}>{decode?.firstName}</Typography>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar imgProps={{ crossOrigin: "false" }} alt="Remy Sharp" src={profileImg(profileImagePath)} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => {
                    handleCloseUserMenu()
                    navigate(`/profile/${decode._id}`)
                  }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleModalOpenPass()
                  }} >
                    <Typography textAlign="center">Reset Password</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleCloseUserMenu()
                    Cookies.remove('_info')
                    Cookies.remove('_sid')
                    Cookies.remove('_token')
                    // localStorage.removeItem('userData')
                    localStorage.removeItem('_info')
                    localStorage.removeItem('_token')
                    navigate('/signin')
                  }}>
                    <Typography textAlign="center">Log Out</Typography>
                  </MenuItem>
                </Menu>
              </Box> : ""
          }
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          // container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none', lg: 'none', xl: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: 'none', sm: 'none', md: 'block', lg: 'block', xl: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component={'main'} sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
      {/* Modal */}
      <BootstrapDialog
        onClose={handleClosePass}
        aria-labelledby="customized-dialog-title"
        open={openModalP}

      >
        <BootstrapDialogTitle id="customized-dialog-title" className="text-center"
          onClose={handleClosePass}
        >
          Change Password
        </BootstrapDialogTitle>
        <DialogContent sx={{
          display: "flex", justifyContent: "center", flexDirection: "column",
          overflowY: "auto",
          gap: "1rem"
        }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Old</InputLabel>
            <OutlinedInput
              onKeyDown={handleSpaceKeyPress}
              onChange={
                (e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value.trim() })}
              id="currentpassword"
              type={showPassword.currentPassword ? 'text' : 'password'}

              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword({ ...showPassword, currentPassword: !showPassword.currentPassword })}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              name="password"
            />
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">New</InputLabel>
            <OutlinedInput
              onKeyDown={handleSpaceKeyPress}

              id="newpassword"
              onChange={
                (e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value.trim(), notes: "" })}
              type={showPassword.newPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              name="password"
            />
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Confirm</InputLabel>
            <OutlinedInput
              onKeyDown={handleSpaceKeyPress}

              id="confirmpassword"
              type={showPassword.confirmPassword ? 'text' : 'password'}
              onChange={
                (e) => {
                  setPasswordChange({ ...passwordChange, confirmPassword: e.target.value, notes: "" })
                }
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              name="password"
            />
          </FormControl>
          {passwordChange.notes.length > 0 ? <span style={{ color: "red" }}>{passwordChange.notes}</span> : null}

        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            disabled={(passwordChange.currentPassword && passwordChange.confirmPassword && passwordChange.newPassword) ? false : true}
            variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
              passwordChangeOp()
            }}>
            Update
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Popover
        open={openManual}
        anchorEl={anchorElManual}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={style}>
          <Typography id="notepad-title" variant="h6" component="h2">
            Notepad
          </Typography>
          <Typography id="notepad-description" sx={{ mt: 2 }}>
            There are 4 types of roles in this system. Admin, Project Lead, Team Lead, Employee. Dummy Account of each user is given below - <br /> <br />

            <b>Admin</b><br />
            Email: admin@portal.gmail.com
            <br />
            password: Admin
            <br />

            <b>Project Lead</b><br />
            Email: projectlead@portal.gmail.com
            <br />
            password: ProjectLead
            <br />

            <b>Team Lead</b><br />
            Email: teamlead@portal.gmail.com
            <br />
            password: Teamlead
            <br />

            <b>Employee</b><br />
            Email: useremployee@portal.gmail.com
            <br />
            password: Useremployee

          </Typography>
          <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">
            Close
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default Topnavbar