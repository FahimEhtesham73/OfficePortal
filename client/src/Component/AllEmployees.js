import React, { useState } from 'react'
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
import Grid from '@mui/material/Grid';
// importing images
import saimom from '../images/saimom.jpg'


const AllEmployees = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        <MenuItem key={setting} onClick={handleClose}>
          <Typography textAlign="center">{setting}</Typography>
        </MenuItem>
      ))}
    </Menu>
  )

  return (
    <>
      <Box >

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Employee</Typography>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }}>
            Add Employee
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "40px", maxWidth: "2618px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField id="outlined-search" label="Employee ID" type="search" sx={{ width: '100%' }} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField id="outlined-search" label="Employee Name" type="search" sx={{ width: '100%' }} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // value={age}
                  label="Age"
                // onChange={handleChange}
                >
                  <MenuItem value={10}>Associate Software Engineer</MenuItem>
                  <MenuItem value={20}>Associate AI Engineer</MenuItem>
                  <MenuItem value={30}>Team Lead</MenuItem>
                  <MenuItem value={30}>Senior AI Engineer</MenuItem>
                  <MenuItem value={30}>Facility Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button variant="contained" sx={{ width: '100%', height: "55px" }}>Search</Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "40px", maxWidth: "2618px" }}>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation='4' sx={{ width: '100%', maxHeight: 345 }}>
                <CardHeader
                  action={
                    <IconButton aria-label="settings" onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                {menu}
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                  <CardContent>
                    <Avatar alt='Employee' src={saimom} sx={{ width: 120, height: 120 }} />
                  </CardContent>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>MD. Saimom Islam</Typography>
                  <Typography sx={{ fontSize: '13px' }}>Associate Software Engineer</Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation='4' sx={{ width: '100%', maxHeight: 345 }}>
                <CardHeader
                  action={
                    <IconButton aria-label="settings" onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                {menu}
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                  <CardContent>
                    <Avatar alt='Employee' src={saimom} sx={{ width: 120, height: 120 }} />
                  </CardContent>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>MD. Saimom Islam</Typography>
                  <Typography sx={{ fontSize: '13px' }}>Associate Software Engineer</Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation='4' sx={{ width: '100%', maxHeight: 345 }}>
                <CardHeader
                  action={
                    <IconButton aria-label="settings" onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                {menu}
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                  <CardContent>
                    <Avatar alt='Employee' src={saimom} sx={{ width: 120, height: 120 }} />
                  </CardContent>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>MD. Saimom Islam</Typography>
                  <Typography sx={{ fontSize: '13px' }}>Associate Software Engineer</Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation='4' sx={{ width: '100%', maxHeight: 345 }}>
                <CardHeader
                  action={
                    <IconButton aria-label="settings" onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                {menu}
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                  <CardContent>
                    <Avatar alt='Employee' src={saimom} sx={{ width: 120, height: 120 }} />
                  </CardContent>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>MD. Saimom Islam</Typography>
                  <Typography sx={{ fontSize: '13px' }}>Associate Software Engineer</Typography>
                </Box>
              </Card>
            </Grid>

          </Grid>

        </Box>

      </Box>
    </>
  )
}

export default AllEmployees