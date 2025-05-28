
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { deleteProjectApi } from "../../api/projectApi";
import userInfo from "../Hook/useUseInfo";
import userRole from "../Hook/userHook";
import { getAllUserApi, searchUser } from "../../api/userApi"

/**************** mui component ************/
import {
    Box, Button, DialogActions, DialogContent, Grid, TextField, Typography, DialogTitle, ListItemIcon,
    IconButton, FormControl, Dialog, OutlinedInput, Checkbox, InputLabel, ListItemText, MenuItem, Select, TextareaAutosize, Card, Skeleton
} from "@mui/material";
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
import { useNavigate, useParams } from "react-router-dom";
import { createASubProjectApi, deleteSubProjectApi, getAllSubProject } from "../../api/subProjectApi";
import SingleSubProject from "./SingleSubProject";



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200
        }
    },
    getContentAnchorEl: null,
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "center"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "center"
    },
    variant: "menu"
};

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

const SubProject = () => {
    const jwt = localStorage.getItem('_token');
    const [allProject, setAllProject] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [roles, setRoles] = useState([])
    const [teamLead, setTeamLead] = useState([])
    const [supervisor, setSuperVisor] = useState([])
    const [members, setMembers] = useState([])
    const navigate = useNavigate();
    const { id: projectId } = useParams()

    const [projectAdd, setProjectAdd] = useState({
        projectCode: "",
        projectName: "",
        projectDescription: "",
        projectOwner: "",
        projectSuperVisor: [],
        projectSuperVisorName: [],
        superVisorTime: "",
        projectLead: [],
        projectLeadName: [],
        leadTime: "",
        projectMembers: [],
        projectMemberName: [],
        memberTime: "",
        projectStartTime: "",
        projectEndTime: "",
        projectId: projectId
    })

    const handleModalOpen = () => {
        setOpenModal(true);
    };
    
    const handleModalClose = () => {
        setOpenModal(false)
        setProjectAdd({
            projectName: "",
            projectDescription: "",
            projectOwner: "",
            projectSuperVisor: [],
            projectSuperVisorName: [],
            superVisorTime: "",
            projectLead: [],
            projectLeadName: [],
            leadTime: "",
            projectMembers: [],
            projectMemberName: [],
            memberTime: "",
            projectStartTime: "",
            projectEndTime: "",
            projectId: projectId
        })
    }

    async function getProjects() {
        try {
            setLoading(true)
            let response = await getAllSubProject("", jwt, projectId);
            let data = await response.json();
            setLoading(false)
            // console.log(data);
            setAllProject(data.data);
        } catch (e) {
            setLoading(false)

            console.log("somenthing went wrong", e);
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
                    let member = resData.filter((v, i) => (v.roleDetails.name !== "teamlead" && v.roleDetails.name !== "projectlead"))

                    setTeamLead(teamLead);
                    setSuperVisor(superVisor);
                    setMembers(member);

                }
            }
        } catch (e) {

        }
    }

    const createProject = async () => {
        try {
            const { projectSuperVisorName, projectLeadName, projectMemberName, ...rest } = projectAdd;
            // console.log({ rest });

            const data = await createASubProjectApi(rest, jwt, projectId);
            if (data.status === 200) {
                toast.success("Project created successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                setProjectAdd({
                    projectName: "",
                    projectDescription: "",
                    projectOwner: "",
                    projectSuperVisor: [],
                    projectSuperVisorName: [],
                    superVisorTime: "",
                    projectLead: [],
                    projectLeadName: [],
                    leadTime: "",
                    projectMembers: [],
                    projectMemberName: [],
                    memberTime: "",
                    projectStartTime: "",
                    projectEndTime: "",
                    projectId: projectId
                })
                getProjects()
                setOpenModal(!openModal)
            }
            else {
                setProjectAdd({
                    projectName: "",
                    projectDescription: "",
                    projectOwner: "",
                    projectSuperVisor: [],
                    projectSuperVisorName: [],
                    superVisorTime: "",
                    projectLead: [],
                    projectLeadName: [],
                    leadTime: "",
                    projectMembers: [],
                    projectMemberName: [],
                    memberTime: "",
                    projectStartTime: "",
                    projectEndTime: "",
                    projectId: projectId
                })
                let resData = await data.json()
                // console.log("res", resData);
                toast.warning(resData?.message || "Something went wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                // setOpenModal(!openModal)


            }

        } catch (err) {
            console.log("err", err);
            toast.warning("Something went wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            setProjectAdd({
                projectName: "",
                projectDescription: "",
                projectOwner: "",
                projectSuperVisor: [],
                projectSuperVisorName: [],
                superVisorTime: "",
                projectLead: [],
                projectLeadName: [],
                leadTime: "",
                projectMembers: [],
                projectMemberName: [],
                memberTime: "",
                projectStartTime: "",
                projectEndTime: "",
                projectId: projectId
            })
        }
    }

    const deleteAProject = async (pid, pCode) => {
        try {

            const data = { projectId: pid, subProjectCode: pCode }
            // return
            const response = await deleteSubProjectApi(data, jwt);
            if (response.status === 200) {
                // console.log("delete", await response.json());
                // navigate("/projects")
                getProjects()
                toast.success("Project deleted successfully", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    pauseOnHover: false,
                });
            }
            else {
                toast.warning("Something went wrong", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }
        } catch (err) {
            toast.warning("Something went wrong", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    }

    const handelChange = (e, filed) => {
        // let mappedName = e.target.value.map((val)=> val.split("_")[0]);
        if (filed === "teamlead") {
            let mappedValue = e.target.value.map((val) => val.split("_")[1]);

            // console.log(mappedName, mappedValue);
            setProjectAdd({ ...projectAdd, projectLead: mappedValue, projectLeadName: e.target.value })

        }

        if (filed === "supervisor") {
            let mappedValue = e.target.value.map((val) => val.split("_")[1]);

            // console.log(mappedName, mappedValue);
            setProjectAdd({ ...projectAdd, projectSuperVisor: mappedValue, projectSuperVisorName: e.target.value })

        }

        if (filed === "members") {
            let mappedValue = e.target.value.map((val) => val.split("_")[1]);

            // console.log(mappedName, mappedValue);
            setProjectAdd({ ...projectAdd, projectMembers: mappedValue, projectMemberName: e.target.value })

        }


    }

    useEffect(() => {
        getProjects();
        getRoles()
    }, []);

    return (
        <Box sx={{ marginLeft: { sm: '30px', md: "280px", xs: '30px' }, marginRight: "30px" }}>
            {loading ? (
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

            ) : (
                <>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Sub Project</Typography>
                        {(userRole() === 'Admin') && <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleModalOpen}>
                            Add Sub Project
                        </Button>}
                    </Box>
                    <Grid container spacing={3}>
                        {allProject?.length > 0 ?
                            allProject.map((p) => {
                                // console.log(p);
                                return (
                                    <Grid item xs={12} sm={6} md={3} >

                                        <SingleSubProject project={p} deleteHandler={deleteAProject} />

                                    </Grid>
                                );
                            }) : null}
                    </Grid>
                </>

            )}


            {/* modal */}

            <BootstrapDialog
                onClose={handleModalClose}
                aria-labelledby="customized-dialog-title"
                open={openModal}

                sx={{ ".MuiPaper-root": { width: "800px", }, }}

            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleModalClose}>
                    Create Sub Project
                </BootstrapDialogTitle>
                <DialogContent sx={{
                    display: "flex", justifyContent: "center", flexDirection: "column",
                    overflowY: "auto",


                }}>
                    {/* Project Name */}
                    <TextField id="projectName" label="Project Name " name='projectName' type="search" sx={{ width: "100%", }}
                        onChange={(e) => setProjectAdd({ ...projectAdd, projectName: e.target.value })}
                        required />
                    <TextField id="outlined-search" label="Project Owner " name='projectOwner' type="search" sx={{ width: "100%", margin: ".5rem 0", }}
                        onChange={(e) => setProjectAdd({ ...projectAdd, projectOwner: e.target.value })}
                        required />
                    <TextField id="outlined-search" label="Project Code " value={projectAdd.projectCode} name='projectCode' type="search" sx={{ width: "100%", margin: ".5rem 0", }}
                        onChange={(e) => {
                            let upperCaseValue = e.target.value.toUpperCase()
                            setProjectAdd({ ...projectAdd, projectCode: upperCaseValue })

                        }

                        }
                        required />
                    <TextField
                        multiline
                        rows={3} id="outlined-search" label="Project Details " name='projectDetails' type="search" sx={{ width: "100%", margin: ".5rem 0", }}
                        onChange={(e) => setProjectAdd({ ...projectAdd, projectDescription: e.target.value })}
                        required />
                    {/* ".MuiSelect-nativeInput":  {height: "39px"} */}
                    <Box sx={{ width: "100%", m: ".5rem 0", display: { sm: "flex" }, justifyContent: "center", alignItems: "center" }}>
                        <FormControl sx={{ width: { xs: "100%", sm: "80%" } }}>
                            <InputLabel id="demo-simple-select-label" >Select Supervisor *</InputLabel>
                            <Select
                                multiple
                                labelId="demo-simple-select-label"
                                label="Select Supervisor *"
                                value={projectAdd.projectSuperVisorName}
                                onChange={(e) => handelChange(e, "supervisor")}
                                // placeholder="Select super visor"
                                renderValue={(selected) => selected.map(v => v.split("_")[0]).join(", ")}
                                MenuProps={MenuProps}
                            >
                                {
                                    supervisor && supervisor.map((option, ind) => {
                                        return (
                                            <MenuItem key={option._id} value={option.firstName + "_" + option._id} data-name={option._id} >
                                                <ListItemIcon>
                                                    <Checkbox checked={projectAdd.projectSuperVisor.indexOf(option._id) > -1} />
                                                </ListItemIcon>
                                                <ListItemText primary={option.firstName} />
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <TextField id="outlined-search" label="Total Hour "
                            placeholder="Numeric value"
                            name='firstName' type="search" sx={{ width: { xs: "100%", sm: "30%", }, margin: ".5rem 0", }}
                            value={projectAdd.superVisorTime}
                            onChange={(e) => {
                                let val = e.target.value.replace(/[^0-9]/g, '');
                                setProjectAdd({ ...projectAdd, superVisorTime: val })

                            }}
                            required />
                    </Box>
                    <Box sx={{ width: "100%", m: ".5rem 0", display: { sm: "flex" }, justifyContent: "center", alignItems: "center" }}>
                        <FormControl sx={{ width: { xs: "100%", sm: "80%" } }}>
                            <InputLabel id="demo-multiple-checkbox-label">Select Team Lead*</InputLabel>

                            {/* Test */}
                            <Select
                                labelId="demo-simple-select-label"
                                label="Select Teamlead *"
                                multiple
                                value={projectAdd.projectLeadName}
                                onChange={(e) => handelChange(e, "teamlead")}
                                placeholder="Select leam visor"
                                renderValue={(selected) => selected.map(v => v.split("_")[0]).join(", ")}
                                MenuProps={MenuProps}
                            >
                                {teamLead && teamLead.map((option) => {
                                    return (
                                        // value={{id:option._id,name:option.userName}}

                                        <MenuItem key={option._id} value={option.firstName + "_" + option._id} data-name={option._id} >
                                            <ListItemIcon>
                                                <Checkbox checked={projectAdd.projectLead.indexOf(option._id) > -1} />
                                            </ListItemIcon>
                                            <ListItemText primary={option.firstName} />
                                        </MenuItem>
                                    )
                                })}
                            </Select>

                        </FormControl>
                        <TextField id="outlined-search" label="Total Hour "
                            placeholder="Numeric value"

                            name='leadTime' type="search" sx={{ width: { xs: "100%", sm: "30%", }, margin: ".5rem 0", }}
                            value={projectAdd.leadTime}
                            onChange={(e) => setProjectAdd({ ...projectAdd, leadTime: e.target.value.replace(/[^0-9]/g, '') })}
                            required />
                    </Box>

                    <Box sx={{ width: "100%", m: ".5rem 0", display: { sm: "flex" }, justifyContent: "center", alignItems: "center" }}>
                        <FormControl sx={{ width: { xs: "100%", sm: "80%" } }}>
                            <InputLabel id="demo-multiple-checkbox-label">Select Members*</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                label="Select Teamlead *"
                                multiple
                                value={projectAdd.projectMemberName}
                                onChange={(e) => handelChange(e, "members")}
                                placeholder="Select Members"
                                renderValue={(selected) => selected.map(v => v.split("_")[0]).join(", ")}
                                MenuProps={MenuProps}
                            >
                                {members && members.map((option) => {
                                    return (
                                        // value={{id:option._id,name:option.userName}}

                                        <MenuItem key={option._id} value={option.firstName + "_" + option._id} data-name={option._id} >
                                            <ListItemIcon>
                                                <Checkbox checked={projectAdd.projectMembers.indexOf(option._id) > -1} />
                                            </ListItemIcon>
                                            <ListItemText primary={option.firstName} />
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <TextField id="outlined-search" label="Total Hour "
                            placeholder="Numeric value"

                            name='firstName' type="search" sx={{ width: { xs: "100%", sm: "30%", }, margin: ".5rem 0", }}
                            value={projectAdd.memberTime}
                            onChange={(e) => setProjectAdd({ ...projectAdd, memberTime: e.target.value.replace(/[^0-9]/g, '') })}
                            required />
                    </Box>

                    <Box sx={{ minWidth: 120, m: ".5rem 0", display: { xs: "inline-block", sm: "flex" }, justifyContent: "space-between" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}  >
                            <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem", } }} >
                                <DatePicker label="Start Time *" slotProps={{
                                    textField: {
                                        error: false,
                                    },
                                }} value={dayjs(projectAdd.projectStartTime)} sx={{ width: { xs: "100%", sm: "100%" } }} onChange={(e, x) => {
                                    if (e?.['$d']) {

                                        setProjectAdd({ ...projectAdd, projectStartTime: new Date(e?.['$d']) })
                                    }

                                }} />
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem" } }} >
                                <DatePicker label="End Time *" slotProps={{
                                    textField: {
                                        error: false,
                                    },
                                }} value={dayjs(projectAdd.projectEndTime)} sx={{ width: { xs: "100%", sm: "100%" } }} onChange={(e, x) => {
                                    if (e?.['$d']) {

                                        setProjectAdd({ ...projectAdd, projectEndTime: new Date(e?.['$d']) })
                                    }

                                }} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Box>

                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained"
                        disabled={(
                            projectAdd.projectStartTime &&
                            projectAdd.projectOwner &&
                            projectAdd.projectEndTime &&
                            projectAdd.projectLead.length &&
                            // projectAdd.superVisorTime &&
                            // projectAdd.projectSuperVisor.length &&
                            projectAdd.leadTime &&

                            projectAdd.projectMembers.length &&
                            projectAdd.memberTime &&

                            projectAdd.projectName &&
                            projectAdd.projectCode &&
                            (projectAdd.projectStartTime < projectAdd.projectEndTime)
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

export default SubProject;
