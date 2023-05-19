import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import EngineeringIcon from '@mui/icons-material/Engineering';
import LoginIcon from '@mui/icons-material/Login';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
// Importing Component
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import userRole from '../Hook/userHook';
import { profileImg } from '../functions/commonFunc';
import userInfo from '../Hook/useUseInfo';
import { getSingleUser } from '../../api/userApi';



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

  const token = Cookies.get('_info');
  const jwtToken = Cookies.get("_token") 
  // console.log(token);
  let decode = ''
  if (token) {
    decode = jwtDecode(token)
  } else {
    decode = ''
  }


  const id = decode?._id
  // For handling Drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpenLeave(!openLeave);
  };
  console.log("profile", profileInfo);

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

  const loginUser = () =>{

    getSingleUser(profileInfo?._id, jwtToken).then(d=> {
      console.log("d",d);
      setProfileImagePath(d?.data[0]?.imagePath)
    }).catch(e=> {
      console.log(e);
    })

  }

  useEffect(()=> {
    loginUser()
  })

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
          !Cookies.get('_info') ?
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
            </ListItem> :
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
                    <ListItemText primary={'Attendence Sheet'} sx={{ opacity: open ? 1 : 0 }} />
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
                  (userRole() === 'Admin' || userRole() === 'Team Lead') &&
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
                    onClick={() => { saveMenuData('teamlead') }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <EngineeringIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Team Leads'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
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
      <AppBar position="fixed">
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
            NSL Leave Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {
            Cookies.get('_info') ?
              <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                <Typography variant="p" component="div" sx={{ marginRight: "15px" }}>{decode?.firstName}</Typography>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar imgProps={{crossOrigin: "false"}} alt="Remy Sharp"  src={profileImg(profileImagePath)} />
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
                    navigate(`/profile/${id}`)
                  }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem >
                    <Typography textAlign="center">Settings</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleCloseUserMenu()
                    Cookies.remove('_info')
                    Cookies.remove('_sid')
                    Cookies.remove('_token')
                    // localStorage.removeItem('userData')
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

    </Box>
  )
}

export default Topnavbar