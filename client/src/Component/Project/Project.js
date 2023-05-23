import React, { useEffect, useState } from "react";
import SingleProject from "./SingleProject";
import Cookies from "js-cookie";
import { createAProjectApi, getAllProject } from "../../api/projectApi";
import userInfo from "../Hook/useUseInfo";
import userRole from "../Hook/userHook";
import { getAllUserApi, searchUser } from "../../api/userApi"

/**************** mui component ************/
import { Box, Button, DialogActions, DialogContent, FormControl, Grid, TextField, Typography, DialogTitle, IconButton, Dialog, InputLabel, Select, MenuItem, OutlinedInput, ListItemIcon, Checkbox, ListItemText } from "@mui/material";
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';


/******** icon **********/
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getAllDesignations } from "../../api/designationApi";
import { getAllRoles } from "../../api/roleApi";
import dayjs from "dayjs";



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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



const Project = () => {
  const jwt = Cookies.get("_token");
  const [allProject, setAllProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false)
  const userData = userInfo();
  const [roles, setRoles] = useState([])
  const [teamLead, setTeamLead] = useState([])
  const [supervisor, setSuperVisor] = useState([])

  const [projectAdd, setProjectAdd] = useState({
    projectName: "",
    projectSuperVisor: "",
    projectLead: [],
    projectLeadName: "",
    projectStartTime: "",
    projectEndTime: ""
  })

  const handleModalOpen = () => {
    setOpenModal(!openModal);
  };
  async function getProjects() {
    try {
      let response = await getAllProject("", jwt);
      let data = await response.json();
      // console.log(data);
      setAllProject(data.data);
    } catch (e) {
      console.log("somenthin went wrong", e);
    }
  }

  const getRoles = async () => {
    try {
      let data = await getAllUserApi(jwt);
      if (data?.status === 200) {
        let resData = await data.json();
        // console.log(resData);

        setRoles(resData)
        if (resData.length) {
          let teamLead = resData.filter((v, i) => v.roleDetails.name === "teamlead");
          let superVisor = resData.filter((v, i) => v.roleDetails.name === "projectlead")

          setTeamLead(teamLead);
          setSuperVisor(superVisor)

        }
      }
    } catch (e) {

    }
  }
  const createProject = async () => {
    try {
      const data = await createAProjectApi(projectAdd, jwt);
      if (data.status === 200) {
        toast.success("Project created successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        setProjectAdd({
          projectName: "",
          projectSuperVisor: "",
          projectLead: "",
          projectStartTime: "",
          projectEndTime: ""
        })
        getProjects()
        setOpenModal(!openModal)
      }
      if (data.status !== 200) {
        setProjectAdd({
          projectName: "",
          projectSuperVisor: "",
          projectLead: "",
          projectStartTime: "",
          projectEndTime: ""
        })
        let resData = await data.json()
        // console.log("res", resData);
        toast.warning(resData?.message || "Something went wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        // setOpenModal(!openModal)


      }

    } catch (err) {
      console.log("err", err);
      // toast.warning("Something went wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })

    }
  }

  console.log("projec add", projectAdd);

 const  handelChange = (e)=> {
  console.log(e);

  // setProjectAdd({...projectAdd, projectLead: [...projectAdd.projectLead, e.target.value]})
 }
  useEffect(() => {
    getProjects();
    getRoles()
  }, []);




  return (
    <Box sx={{ marginLeft: { sm: '30px', md: "280px", xs: '30px' }, marginRight: "30px" }}>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Project</Typography>
        {userRole() === 'Admin' && <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleModalOpen}>
          Add Project
        </Button>}
      </Box>
      <Grid container spacing={3}>
        {allProject?.length &&
          allProject.map((p) => {
            // console.log(p);
            return (
              <Grid item xs={12} sm={6} md={3} >

                <SingleProject project={p} />

              </Grid>
            );
          })}
      </Grid>










      {/* modal */}

      <BootstrapDialog
        onClose={handleModalOpen}
        aria-labelledby="customized-dialog-title"
        open={openModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleModalOpen}>
          Create Project
        </BootstrapDialogTitle>
        <DialogContent sx={{
          display: "flex", justifyContent: "center", flexDirection: "column",
          overflowY: "auto"
        }}>
          {/* Project Name */}
          <TextField id="outlined-search" label="Project Name " name='firstName' type="search" sx={{ width: "100%", margin: ".5rem 0" }}
            onChange={(e) => setProjectAdd({ ...projectAdd, projectName: e.target.value })}
            required />
          {/* Last name */}


          {/* Department */}
          <Box sx={{ minWidth: 120, m: ".5rem 0" }}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">Select Supervisor*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Age"
                onChange={(e) => {
                  setProjectAdd({ ...projectAdd, projectSuperVisor: e.target.value })
                  // setFilteredId(e.target.value)
                }}
              >
                {
                  supervisor && supervisor.map((val, ind) => {
                    return (
                      <MenuItem value={val._id}>{val.firstName}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ width: "100%", m: ".5rem 0" }}>
              <InputLabel id="demo-multiple-checkbox-label">Select Team Lead*</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={projectAdd.projectLead}
                input={<OutlinedInput  />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                
                onChange={handelChange}
              >
                {
                  teamLead && teamLead.map((val, ind) => {
                   
                    return (
                      <MenuItem key={ind} value={val.firstName} data-name = {val._id}  >
                          <Checkbox checked={projectAdd.projectLead.indexOf(val._id) > -1 }  />
                          <ListItemText primary={val.firstName} />
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Box>
          {/* Employee ID */}

          <Box sx={{ minWidth: 120 }}>

            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DemoContainer components={['DatePicker']} >
                <DatePicker label="Start Time *" slotProps={{
                  textField: {
                    error: false,
                  },
                }} value={dayjs(projectAdd.projectStartTime)} sx={{ width: 365, maxHeight: 345, }} onChange={(e, x) => {
                  // setUserInfo(e)
                  // setUser({ ...user, joiningDate: e?.['$d'] ? e['$d'] : "" })
                  // setSelectedDate(e)
                  // console.log("date Change", e?.['$d'] ? e['$d'] : "");
                  setProjectAdd({ ...projectAdd, projectStartTime: new Date(e?.['$d']) })

                }} />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Box sx={{ minWidth: 120, m: ".5rem 0" }}>

            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DemoContainer components={['DatePicker']} >
                <DatePicker label="End Time *" slotProps={{
                  textField: {
                    error: false,
                  },
                }} value={dayjs(projectAdd.projectEndTime)} sx={{ width: 365, maxHeight: 345, }} onChange={(e, x) => {
                  // setUserInfo(e)
                  // setUser({ ...user, joiningDate: e?.['$d'] ? e['$d'] : "" })
                  // setSelectedDate(e)
                  // console.log("date Change", e?.['$d'] ? e['$d'] : "");
                  setProjectAdd({ ...projectAdd, projectEndTime: new Date(e?.['$d']) })

                }} />
              </DemoContainer>
            </LocalizationProvider>
          </Box>

        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained"
            disabled={(projectAdd.projectStartTime &&
              projectAdd.projectEndTime &&
              projectAdd.projectLead &&
              projectAdd.projectSuperVisor &&
              projectAdd.projectName
            ) ? false : true}
            sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
              createProject()
            }}>
            Create
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  );
};

export default Project;
