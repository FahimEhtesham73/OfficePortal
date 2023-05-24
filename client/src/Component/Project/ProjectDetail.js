import { Grid, Stack, Box, Typography, Avatar, ListItemText, ListItemAvatar, ListItem, Divider, List, Button, Card, DialogTitle, DialogContent, IconButton, Dialog, TextField, DialogActions, Select, InputLabel, FormControl } from "@mui/material";
import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { styled } from '@mui/material/styles';
import userRole from "../Hook/userHook";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useParams } from "react-router-dom";
import { getAprojectApi } from "../../api/projectApi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";









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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const ProjectDetail = () => {
    const jwt = Cookies.get("_token");

    const [projectInfo, setProjectInfo] = useState({});
    const {id} = useParams() ;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [edittedProject, setEditedProject] = useState({
        ...projectInfo
    })
    

    const [modals, setModals] = useState({
        modal1: false,
        modal2: false,
        // Add more modals as needed
      });


    const openModal = (modalName) => {
        setModals((prevModals) => ({
          ...prevModals,
          [modalName]: true,
        }));
      };
      
      const closeModal = (modalName) => {
        setModals((prevModals) => ({
          ...prevModals,
          [modalName]: false,
        }));
      };


const getSingleProject = async () => {
    try{
        const response = await getAprojectApi(id,jwt);
        setLoading(true)
        if(response.status === 200){
        setLoading(false)

            const data = await response.json();
            let temp = data?.data[0];
            setProjectInfo(temp)
            
        }
        else{
            //waring
        setLoading(false)

            navigate("/projects")
        }

    }catch(err){
        setLoading(false)
        navigate("/projects")

        console.log("error occured");
    }
}

// console.log("project info", projectInfo);


useEffect(()=> {
    getSingleProject()
}, [])


    return (
        <Box
            sx={{
                marginLeft: { sm: "30px", md: "280px", xs: "30px" },
                marginRight: "30px",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Project</Typography>
                {userRole() === 'Admin' && <Button variant="contained"
                onClick={()=> openModal("modal1")}
                startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} >
                    Edit Project
                </Button>}
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Stack>
                        <Item sx={{ textAlign: "justify", p: "1rem" }}  >
                            <Typography sx={{ fontSize: "2rem", fontWeight: "500", textAlign: "left" }}>{projectInfo?.projectName}</Typography>
                            
                        </Item>

                    </Stack>
                </Grid>

                <Grid item xs={12} md={4} sx={{ p: "0", width: "100%" }}>
                    <Stack spacing={1} >
                        <Item sx={{ p: "1rem" }}>
                            <Typography>Project Detail</Typography>
                            <table class="table table-striped table-border">
                                <tbody style={{ textAlign: "left" }}>
                                <tr>
                                        <td>Project Owner:</td>
                                        <td class="text-end">{projectInfo?.projectOwner}</td>
                                    </tr>
                                <tr>
                                        <td>Total Supervisors Hours:</td>
                                        <td class="text-end">{projectInfo?.superVisorTime}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Teamleads Hours:</td>
                                        <td class="text-end">{projectInfo?.leadTime}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Members Hours:</td>
                                        <td class="text-end">{projectInfo?.memberTime}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Hours:</td>
                                        <td class="text-end">{[projectInfo?.leadTime, projectInfo?.superVisorTime, projectInfo?.memberTime].reduce((a,c)=> a +=c, 0) || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Created:</td>
                                        <td class="text-end">{new Date(projectInfo?.projectStartTime).toDateString("en-Us")}</td>
                                    </tr>
                                    <tr>
                                        <td>Deadline:</td>
                                        <td class="text-end">{new Date(projectInfo?.projectEndTime).toDateString("en-Us")}</td>
                                    </tr>


                                    <tr>
                                        <td>Status:</td>
                                        <td class="text-end" style={{color: `${projectInfo?.isCurrentlyActive? "green": "Black"}` }}>{projectInfo?.isCurrentlyActive? "Active": "In Active"}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </Item>

                        <Item sx={{ ".MuiListItemText-primary": { color: "black" }, boxShadow: "none" }} >
                            <div class="card project-user">
                                <div class="card-body">
                                    <h6 class="card-title m-b-20 d-flex justify-content-around align-items-baseline">
                                        <p> Assigned Leader </p>
                                        {/* <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} >
                                            Add Leader
                                        </Button> */}
                                    </h6>
                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', ".MuiListItem-root": {
                                        display: "flex", justifyContent: "center", alignItems: "center"
                                    } }}>

                                        {/* {projectInfo} */}
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar imgProps={{crossOrigin: "false"}} alt="Remy Sharp" src={`${projectInfo?.projectSuperVisorDetails?.imagePath}`} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${projectInfo?.projectSuperVisorDetails?.firstName}`}
                                                
                                            />
                                        </ListItem>
                                        {/* <Divider variant="inset" component="li" /> */}
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar imgProps={{crossOrigin: "false"}} alt="Remy Sharp" src={`${projectInfo?.projectLeadDetails?.imagePath}`} />
                                            </ListItemAvatar>
                                            <ListItemText
                                            primary={`${projectInfo?.projectLeadDetails?.firstName}`}

                                            />
                                            {/* <DeleteIcon /> */}
                                        </ListItem>


                                    </List>
                                </div>
                            </div>
                        </Item>

                        <Item sx={{ ".MuiListItemText-primary": { color: "black" }, boxShadow: "none" }} >
                            <div class="card project-user">
                                <div class="card-body">
                                    <h6 class="card-title m-b-20 d-flex justify-content-around align-items-baseline">
                                        <p> Assigned Members </p>
                                        <Button variant="contained" 
                                        onClick={()=> openModal("modal2") }
                                        startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} >
                                            Add Members
                                        </Button>
                                    </h6>
                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', ".MuiListItem-root": {
                                        display: "flex", justifyContent: "center", alignItems: "center"
                                    } }}>
                                        {projectInfo?.projectMembersList?.map((v,i)=> {

                                            return (
                                                <>
                                                
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar imgProps={{crossOrigin: "false"}} alt="img" src={v?.imagePath}/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={v?.firstName}
                                                // secondary={
                                                //     <React.Fragment>
                                                //         <Typography
                                                //             sx={{ display: 'inline' }}
                                                //             component="span"
                                                //             variant="body2"
                                                //             color="text.primary"
                                                //         >
                                                //             Role
                                                //         </Typography>
                                                //     </React.Fragment>
                                                // }
                                            />
                                        </ListItem>
                                                
                                                </>
                                            )
                                        })}
                                        {/* <Divider variant="inset" component="li" /> */}
                                        


                                    </List>
                                </div>
                            </div>
                        </Item>

                    </Stack>

                </Grid>
            </Grid>

            {/* edit  project modal */}

            <BootstrapDialog
                  onClose={(e)=> closeModal("modal1")}
                aria-labelledby="customized-dialog-title"
                open={modals.modal1}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center"  >
                    Edit Project
                </BootstrapDialogTitle>
                <DialogContent sx={{
                    display: "flex", justifyContent: "center", flexDirection: "column",
                    overflowY: "auto"
                }}>
                    <TextField id="outlined-search" label="Project name " name='firstName' type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "0px 20px 10px 0px" }} onChange={(e) => { }} required />


                    {/* Designation */}
                    <Box sx={{ minWidth: 120 }}>

                        <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 0px 0px 0px" }}>
                            <InputLabel id="demo-simple-select-label">Project Lead *</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='designation'
                                value={""}
                                label="Select leave type"
                                onChange={(e) => {
                                    // setUserInfo(e)
                                }}
                            >
                                {/* {
                    designation && designation.map((des) => {
                      return (
                        <MenuItem value={des._id}>{des.name}</MenuItem>
                      )
                    })
                  } */}

                            </Select>
                        </FormControl>
                    </Box>

                    {/* Department */}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ minWidth: 365, maxHeight: 345, margin: "10px 0px 0px 0px" }}>
                            <InputLabel id="demo-simple-select-label">Team Lead *</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='department'
                                label="Select leave type"
                                value={""}
                                onChange={(e) => {
                                    // setUserInfo(e)
                                }}
                            >
                                {/* {
                    department && department.map((dept) => {
                      return (
                        <MenuItem value={dept._id}>{dept.alias}</MenuItem>
                      )
                    })
                  } */}

                            </Select>
                        </FormControl>
                    </Box>
                    

                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} >
                            <DatePicker label="Start Date *" sx={{ width: 365, maxHeight: 345, }} onChange={(e, x) => {


                            }} />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} >
                            <DatePicker label="End Date *" sx={{ width: 365, maxHeight: 345, }} onChange={(e, x) => {


                            }} />
                        </DemoContainer>
                    </LocalizationProvider>

                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {

                    }}>
                        Create
                    </Button>
                </DialogActions>
            </BootstrapDialog>

            <BootstrapDialog
                  onClose={()=> closeModal("modal2")}
                aria-labelledby="customized-dialog-title"
                open={modals.modal2}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center"  >
                    Add Members
                </BootstrapDialogTitle>
                <DialogContent sx={{
                    display: "flex", justifyContent: "center", flexDirection: "column",
                    overflowY: "auto"
                }}>
                    <TextField id="outlined-search" label="Employe Name " name='firstName' type="search" sx={{ minWidth: 365, maxHeight: 345, margin: "10px 20px 10px 0px" }} onChange={(e) => { }} required />




                    {[1, 2, 3].map((v, i) => {
                        return (

                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="John Doe"
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    Role
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>



                            </List>
                        )
                    })}


                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {

                    }}>
                        Update
                    </Button>
                </DialogActions>
            </BootstrapDialog>

        </Box>
    );
};

export default ProjectDetail;
