import React, { useState, useEffect } from 'react'
// Importing from MUI
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
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
import Collapse from '@mui/material/Collapse';
import StarBorder from '@mui/icons-material/StarBorder';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PeopleIcon from '@mui/icons-material/People';
import GridOnIcon from '@mui/icons-material/GridOn';
import BallotIcon from '@mui/icons-material/Ballot';
import EngineeringIcon from '@mui/icons-material/Engineering';
// Importing Component
import Dashboard from '../Dashboard';
import Attendancesheet from '../Attendancesheet';
import Holidays from '../Holidays';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import LeaveEmployee from '../Leave/LeaveEmployee';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import LeaveStatusLead from '../Leave/LeaveStatusLead';
import Teamlead from '../TeamLead/Teamlead';


const drawerWidth = 240;
const settings = ['Profile', 'Settings','Logout'];


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
  // const { window } = props;
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [menuData, setMenuData] = useState('All Employees')
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openLeave, setOpenLeave] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)


  // For handling Drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpenLeave(!openLeave);
  };

  // For Profile Settings
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const saveMenuData = (text)=>{
    setMenuData(text)
  }


  const drawer = (
    <div>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {['All Employees', 'Attendance Sheet', 'Holidays','Leaves','Leave Status','Team Leads'].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={()=>{text === 'Drafts' ? handleClick() : saveMenuData(text)}}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {(index === 0 && <PeopleIcon/>) || (index===1 && <GridOnIcon/>) || (index===2 && <HolidayVillageIcon/>) || (index ===3 && <EmojiTransportationIcon/>) || (index === 4 && <BallotIcon/> || (index === 5 &&<EngineeringIcon/> ))}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              {/* {text === 'Drafts' ? openLeave ? <ArrowDropDownIcon /> : <ArrowRightIcon /> : ""} */}
            </ListItemButton>
                {/* Nested List */}
            {/* {text === 'Drafts' && <Collapse in={openLeave} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Starred" />
                </ListItemButton>
              </List>
            </Collapse>} */}
          </ListItem>
        ))}
      </List>
    </div>
  )

  useEffect(() => {
    // Tracking Browser Width
    window.addEventListener('resize',()=>{
      setWidth(window.innerWidth)
    })
    if (width>=600) {
      setOpen(true)
    }
    return () => window.removeEventListener("resize", ()=>{
      setWidth(window.innerWidth)
    })
  
  },[width])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {width < 600 && setOpen(!open) }}
            edge="start"
          >
            {width < 600 && <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            NSL Leave Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
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
            display: { xs: 'block', sm: 'none' },
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
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component={'main'} sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {menuData === 'All Employees' && <Dashboard />}
        {menuData === 'Attendance Sheet' && <Attendancesheet />}
        {menuData === 'Holidays' && <Holidays/>}
        {menuData === 'Leaves' && <LeaveEmployee/>}
        {menuData === 'Leave Status' && <LeaveStatusLead/>}
        {menuData === 'Team Leads' && <Teamlead/>}
      </Box>

    </Box>
  )
}

export default Topnavbar