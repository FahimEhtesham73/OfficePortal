import { Grid, Stack, Box, Typography, Avatar, ListItemText, ListItemAvatar, ListItem, Divider, List, Button, Card, DialogTitle, DialogContent, IconButton, Dialog, TextField, DialogActions, Select, InputLabel, FormControl, ListItemIcon, Checkbox, MenuItem, Chip } from "@mui/material";
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
import { getAllTaskApi, getAprojectApi, updateProjectApi } from "../../api/projectApi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { profileImg, taskDataPrepration } from "../functions/commonFunc";
import Loading from "../Hook/Loading/Loading";
import { getAllUserApi } from "../../api/userApi";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ProjectTask from "../ProjectTask/ProjectTask";
import { getASubprojectApi, updateSubProjectApi } from "../../api/subProjectApi";


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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const SubProjectDetail = () => {
    const jwt = localStorage.getItem('_token');

    const [projectInfo, setProjectInfo] = useState({});
    const { id, subId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [projectDetails, setprojectDetails] = useState({
        projectId: "",
        projectName: "",
        projectDescription: "",
        projectOwner: "",
        superVisorTime: "",
        leadTime: "",
        memberTime: "",
        projectStartTime: "",
        projectEndTime: "",
        isCurrentlyActive: "",
        projectCode: ""
    });
    const [users, setUsers] = useState([]);
    const [teamLead, setTeamLead] = useState([])
    const [supervisor, setSuperVisor] = useState([])
    const [members, setMembers] = useState([])

    const [projectMembers, setProjectMembers] = useState({
        membersId: [],
        membersName: [],
    })

    const [projectTeamLead, setProjectTeamLead] = useState({
        teamLeadId: [],
        teamLeadName: [],
    })

    const [projectSuperVisor, setProjectSuperVisor] = useState({
        supervisorId: [],
        supervisorName: [],
    })

    const [allMembers, setAllMembers] = useState([])
    const [modals, setModals] = useState({
        modal1: false,
        modal2: false,
        modal3: false,
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

    const getAllUsers = async () => {
        try {
            let data = await getAllUserApi(jwt);
            if (data?.status === 200) {
                let resData = await data.json();


                setUsers(resData)
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

    const getSingleProject = async () => {
        try {
            setLoading(true)
            const response = await getASubprojectApi(subId, jwt);
            if (response.status === 200) {
                setLoading(false)

                const data = await response.json();
                let temp = data?.data[0];
                setProjectInfo(temp)
                setAllMembers([...temp?.projectSuperVisorDetails, ...temp?.projectLeadDetails, ...temp?.projectMembersList])
                setprojectDetails({
                    projectId: temp?._id,
                    projectName: temp.projectName,
                    projectDescription: temp.projectDescription,
                    projectOwner: temp.projectOwner,
                    superVisorTime: temp.superVisorTime,
                    leadTime: temp.leadTime,
                    memberTime: temp.memberTime,
                    projectStartTime: temp.projectStartTime,
                    projectEndTime: temp.projectEndTime,
                    isCurrentlyActive: temp.isCurrentlyActive,
                    projectCode: temp.projectCode

                })
                // setProjectMembers({
                //     membersId: temp.projectMembers,
                //     membersName: temp?.projectMembersList.map((m)=> m.firstName+"_"+m._id)
                // })

            }
            else {
                //waring
                setLoading(false)

                navigate("/projects")
            }

        } catch (err) {
            setLoading(false)
            navigate("/projects")

            console.log("error occured");
        }
    }

    // console.log("project info", members);

    const handelChange = (e, filed) => {
        // let mappedName = e.target.value.map((val)=> val.split("_")[0]);
        if (filed === "teamlead") {
            let mappedValue = e.target.value.map((val) => val.split("_")[1]);

            setProjectTeamLead({ teamLeadId: mappedValue, teamLeadName: e.target.value })

        }

        if (filed === "supervisor") {
            let mappedValue = e.target.value.map((val) => val.split("_")[1]);

            setProjectSuperVisor({ supervisorId: mappedValue, supervisorName: e.target.value })

        }

        if (filed === "members") {
            let mappedValue = e.target.value.map((val) => val.split("_")[1]);

            // console.log(mappedName, mappedValue);
            setProjectMembers({ membersId: mappedValue, membersName: e.target.value })

        }


    }

    const updateSingleProject = async (from) => {
        try {
            let updatedData = {
                pId: projectInfo?._id,

            }
            if (from === "eidtProject") {
                updatedData = {
                    ...updatedData,
                    projectName: projectDetails?.projectName,
                    projectDescription: projectDetails?.projectDescription,
                    projectOwner: projectDetails?.projectOwner,
                    superVisorTime: projectDetails?.superVisorTime,
                    leadTime: projectDetails?.leadTime,
                    memberTime: projectDetails?.memberTime,
                    projectStartTime: projectDetails?.projectStartTime,
                    projectEndTime: projectDetails?.projectEndTime,
                    isCurrentlyActive: projectDetails?.isCurrentlyActive,
                    projectCode: projectDetails?.projectCode
                }

                // console.log("eidt project modal", updatedData);
            }
            if (from === "modifyleader") {
                updatedData = {
                    ...updatedData,
                    projectLead: projectTeamLead.teamLeadId,
                    projectSuperVisor: projectSuperVisor.supervisorId,

                }
            }
            if (from === "modifymembers") {
                updatedData = {
                    ...updatedData,
                    projectMembers: projectMembers?.membersId,

                }

            }
            const response = await updateSubProjectApi(updatedData, jwt, id, subId);
            const data = await response.json();
            if (response.status === 200) {
                // setProjectInfo(data.data);
                toast.success("Updated successfully", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    pauseOnHover: false,
                });
                getSingleProject()
                closeModal("modal1")
                closeModal("modal2")
                closeModal("modal3")

            } else {
                toast.warning(data?.message || "No Update", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    pauseOnHover: false,
                });
            }


        } catch (err) {
            toast.warning("Something went wrong", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            });
        }
    }

    useEffect(() => {
        getSingleProject();
        getAllUsers();
    }, [])


    return (
        <>
            {loading ? (<Loading />) : (
                <Box

                    sx={{
                        marginLeft: { sm: "30px", md: "280px", xs: "30px" },
                        marginRight: "30px",
                    }}
                >


                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Sub Project</Typography>
                        {userRole() === 'Admin' && <Button variant="contained"
                            onClick={() => openModal("modal1")}
                            startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} >
                            Edit Sub Project
                        </Button>}
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Stack>
                                <Item sx={{ textAlign: "justify", p: "1rem" }}  >
                                    <Typography sx={{ fontSize: "2rem", fontWeight: "500", textAlign: "left" }}>{projectInfo?.projectName}</Typography>
                                    <p>{projectInfo.projectDescription}</p>

                                </Item>


                                <Item sx={{ textAlign: "justify", p: ".5rem", m: "1rem 0", }}  >
                                    <ProjectTask membersNameId={allMembers} projectDetails={projectDetails} />

                                </Item>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ p: "0", width: "100%" }}>
                            <Stack spacing={1} sx={{ ".text-end": { textAlign: { sm: "end", md: "left" } } }} >
                                <Item sx={{ p: "1rem" }}>
                                    <Typography>Project Detail</Typography>
                                    <table class="table table-striped table-border" style={{
                                        tableLayout: "fixed",
                                        width: "100%"
                                    }}>
                                        <tbody style={{ textAlign: "left" }}>
                                            <tr>
                                                <td>Project Code:</td>
                                                <td class="text-end">{projectInfo?.projectCode}</td>
                                            </tr>
                                            <tr>
                                                <td>Owner:</td>
                                                <td class="text-end">{projectInfo?.projectOwner}</td>
                                            </tr>
                                            <tr>
                                                <td>Supervisors Hours:</td>
                                                <td class="text-end">{projectInfo?.superVisorTime}</td>
                                            </tr>
                                            <tr>
                                                <td>Teamleads Hours:</td>
                                                <td class="text-end">{projectInfo?.leadTime}</td>
                                            </tr>
                                            <tr>
                                                <td>Members Hours:</td>
                                                <td class="text-end">{projectInfo?.memberTime}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Hours:</td>
                                                <td class="text-end">{[projectInfo?.leadTime, projectInfo?.superVisorTime, projectInfo?.memberTime].reduce((a, c) => a += c, 0) || 0}</td>
                                            </tr>
                                            <tr>
                                                <td>Created:</td>
                                                <td class="text-end">{new Date(projectInfo?.projectStartTime).toLocaleDateString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Deadline:</td>
                                                <td class="text-end">{new Date(projectInfo?.projectEndTime).toLocaleDateString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Status:</td>
                                                <td class="text-end" style={{ color: `${projectInfo?.isCurrentlyActive ? "red" : "green"}` }}>{projectInfo?.isCurrentlyActive ? "Locked" : "Running"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Item>

                                <Item sx={{ ".MuiListItemText-primary": { color: "black" }, boxShadow: "none" }} >
                                    <div class="card project-user">
                                        <div class="card-body">
                                            <h6 class="card-title m-b-20 d-flex justify-content-around align-items-baseline">
                                                <p> Assigned Leader </p>
                                                {(userRole() === "Admin" || userRole() === "Project Lead") && (
                                                    <Button variant="contained"
                                                        onClick={() => {
                                                            if (projectDetails.isCurrentlyActive === true) {
                                                                toast.warning("This Project is Locked ", {
                                                                    position: toast.POSITION.TOP_CENTER,
                                                                    autoClose: 1000,
                                                                    pauseOnHover: false,
                                                                });
                                                                return;
                                                            }
                                                            openModal("modal3")
                                                            setProjectSuperVisor({
                                                                supervisorId: projectInfo?.projectSuperVisor,
                                                                supervisorName: projectInfo?.projectSuperVisorDetails.map((m) => m.firstName + "_" + m._id)
                                                            })
                                                            setProjectTeamLead({
                                                                teamLeadId: projectInfo?.projectLead,
                                                                teamLeadName: projectInfo?.projectLeadDetails.map((m) => m.firstName + "_" + m._id)
                                                            })

                                                        }}
                                                        startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} >
                                                        Modify Leader
                                                    </Button>
                                                )}
                                            </h6>
                                            <List sx={{
                                                width: '100%', maxWidth: 360, bgcolor: 'background.paper', ".MuiListItem-root": {
                                                    display: "flex", justifyContent: "center", alignItems: "center"
                                                }
                                            }}>

                                                {/* {projectInfo} */}
                                                {
                                                    projectInfo?.projectSuperVisorDetails && projectInfo.projectSuperVisorDetails.map((m) => (

                                                        <ListItem alignItems="flex-start" key={m?._id}>
                                                            <ListItemAvatar title={`${m.firstName}`}>
                                                                <Avatar imgProps={{ crossOrigin: "false" }} alt="img" src={`${profileImg(m.imagePath)}`} />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={`${m.firstName}`}

                                                            />
                                                        </ListItem>
                                                    ))
                                                }
                                                {/* {projectInfo} */}
                                                {projectInfo?.projectLeadDetails && projectInfo.projectLeadDetails.map((m) => (

                                                    <ListItem alignItems="flex-start" key={m?._id}>
                                                        <ListItemAvatar title={`${m.firstName}`}>
                                                            <Avatar imgProps={{ crossOrigin: "false" }} alt="img" src={`${profileImg(m.imagePath)}`} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                                primary={`${m.firstName}`}

                                                        />
                                                    </ListItem>

                                                ))}

                                            </List>
                                        </div>
                                    </div>
                                </Item>

                                <Item sx={{ ".MuiListItemText-primary": { color: "black" }, boxShadow: "none" }} >
                                    <div class="card project-user">
                                        <div class="card-body">
                                            <h6 class="card-title m-b-20 d-flex justify-content-around align-items-baseline">
                                                <p> Assigned Members </p>
                                                {
                                                    (userRole() === "Admin" || userRole() === "Project Lead" || userRole() === "Team Lead") && (
                                                        <Button variant="contained"
                                                            onClick={() => {
                                                                if (projectDetails.isCurrentlyActive === true) {
                                                                    toast.warning("This Project is Locked ", {
                                                                        position: toast.POSITION.TOP_CENTER,
                                                                        autoClose: 1000,
                                                                        pauseOnHover: false,
                                                                    });
                                                                    return;
                                                                }
                                                                openModal("modal2")
                                                                setProjectMembers({
                                                                    membersId: projectInfo?.projectMembers,
                                                                    membersName: projectInfo?.projectMembersList.map((m) => m.firstName + "_" + m._id)
                                                                })
                                                            }}
                                                            startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} >
                                                            Modify Members
                                                        </Button>

                                                    )
                                                }
                                            </h6>
                                            <List sx={{
                                                width: '100%', maxWidth: 360, bgcolor: 'background.paper', ".MuiListItem-root": {
                                                    display: "flex", justifyContent: "center", alignItems: "center"
                                                }
                                            }}>
                                                {projectInfo?.projectMembersList && projectInfo?.projectMembersList?.map((v, i) => {

                                                    return (

                                                        <ListItem alignItems="flex-start" key={v?._id}>
                                                            <ListItemAvatar title={`${v.firstName}`}>

                                                                <Avatar imgProps={{ crossOrigin: "false" }} alt="img" src={profileImg(v?.imagePath)} />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={v?.firstName}


                                                            />
                                                        </ListItem>

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
                        onClose={(e) => closeModal("modal1")}
                        aria-labelledby="customized-dialog-title"
                        open={modals.modal1}
                    >
                        <BootstrapDialogTitle id="customized-dialog-title" className="text-center"  >
                            Edit Sub Project
                        </BootstrapDialogTitle>
                        <DialogContent sx={{
                            display: "flex", justifyContent: "center", flexDirection: "column",
                            overflowY: "auto",


                        }}>
                            {/* Project Name */}
                            <TextField id="projectName" label="Project Name " value={projectDetails.projectName} name='projectName' type="search" sx={{ width: "100%", margin: ".5rem 0", marginTop: { xs: "5rem", sm: "1rem" } }}
                                onChange={(e) => setprojectDetails({ ...projectDetails, projectName: e.target.value })}
                                required />
                            <TextField id="projectCode" label="Project Code " value={projectDetails.projectCode} name='projectName' type="search" sx={{ width: "100%", margin: ".5rem 0", marginTop: { xs: "5rem", sm: "1rem" } }}
                                onChange={(e) => setprojectDetails({ ...projectDetails, projectCode: e.target.value })}
                                required />

                            <Box sx={{ width: "100%", m: ".5rem 0", display: { sm: "flex" }, justifyContent: "space-between", alignItems: "center" }}>

                                <TextField id="outlined-search" label="Project Owner " value={projectDetails.projectOwner} name='projectOwner' type="search" sx={{ width: "100%", margin: ".5rem 0", }}
                                    onChange={(e) => { setprojectDetails({ ...projectDetails, projectOwner: e.target.value }) }}
                                    required />
                                <Typography sx={{ width: { xs: "100%", sm: "30%", }, margin: ".5rem 0.5rem", }}>Locked</Typography> <Checkbox checked={projectDetails.isCurrentlyActive} value={projectDetails.isCurrentlyActive} onChange={(e) => {
                                    // console.log(e.target);
                                    setprojectDetails({ ...projectDetails, isCurrentlyActive: e.target.checked })
                                }
                                } />

                            </Box>

                            <TextField
                                multiline
                                rows={3} id="outlined-search" label="Project Details " name='projectDetails' value={projectDetails.projectDescription} type="search" sx={{ width: "100%", margin: ".5rem 0", }}
                                onChange={(e) => setprojectDetails({ ...projectDetails, projectDescription: e.target.value })}
                                required />
                            {/* ".MuiSelect-nativeInput":  {height: "39px"} */}
                            <Box sx={{ width: "100%", m: ".5rem 0", display: { sm: "flex" }, justifyContent: "space-between", alignItems: "center" }}>

                                <TextField id="outlined-search" label="Total Hour Supervisor" value={projectDetails.superVisorTime} name='firstName' type="search" sx={{ width: { xs: "100%", sm: "30%", }, margin: ".5rem 0", }}
                                    // value={projectAdd.superVisorTime}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                        setprojectDetails({ ...projectDetails, superVisorTime: val })


                                    }}
                                    required />
                                <TextField id="outlined-search" label="Total Hour Teamlead" name='firstName' type="search" sx={{ width: { xs: "100%", sm: "30%", }, margin: ".5rem 0", }}
                                    value={projectDetails.leadTime}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                        setprojectDetails({ ...projectDetails, leadTime: val })

                                    }}
                                    required />
                                <TextField id="outlined-search" label="Total Hour member" name='firstName' type="search" sx={{ width: { xs: "100%", sm: "30%", }, margin: ".5rem 0", }}
                                    value={projectDetails.memberTime}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                        setprojectDetails({ ...projectDetails, memberTime: val })
                                    }}
                                    required />
                            </Box>


                            <Box sx={{ minWidth: 120, m: ".5rem 0", display: { xs: "inline-block", sm: "flex" }, justifyContent: "space-between" }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                    <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem", } }} >
                                        <DatePicker label="Start Time *" slotProps={{
                                            textField: {
                                                error: false,
                                            },
                                        }}
                                            value={dayjs(projectDetails.projectStartTime)} sx={{ width: { xs: "100%", sm: "100%" } }}
                                            onChange={(e, x) => {
                                                if (e?.['$d']) {

                                                    setprojectDetails({ ...projectDetails, projectStartTime: new Date(e?.['$d']) })
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
                                        }}
                                            value={dayjs(projectDetails.projectEndTime)} sx={{ width: { xs: "100%", sm: "100%" } }}
                                            onChange={(e, x) => {
                                                if (e?.['$d']) {
                                                    setprojectDetails({ ...projectDetails, projectEndTime: new Date(e?.['$d']) })

                                                }


                                            }} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>

                        </DialogContent>
                        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained"
                                disabled={(
                                    projectDetails.projectStartTime &&
                                    projectDetails.projectOwner &&
                                    projectDetails.projectEndTime &&
                                    projectDetails.superVisorTime &&
                                    projectDetails.leadTime &&
                                    projectDetails.memberTime &&

                                    projectDetails.projectName
                                ) ? false : true}
                                sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
                                    //   createProject()
                                    updateSingleProject("eidtProject")
                                }}>
                                Update
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>

                    {/* modal2  */}
                    <BootstrapDialog
                        onClose={() => closeModal("modal2")}
                        aria-labelledby="customized-dialog-title"
                        open={modals.modal2}
                        sx={{ ".css-1t1j96h-MuiPaper-root-MuiDialog-paper": { width: "100%" } }}
                    >
                        <BootstrapDialogTitle id="customized-dialog-title" className="text-center"  >
                            Modify Members
                        </BootstrapDialogTitle>
                        <DialogContent sx={{
                            display: "flex", justifyContent: "center", flexDirection: "column",
                            overflowY: "auto"
                        }}>

                            <Box sx={{ m: ".5rem 0", ".css-1t1j96h-MuiPaper-root-MuiDialog-paper": { width: "100% !important" } }}>
                                <FormControl fullWidth >
                                    <InputLabel id="demo-multiple-chip-label">Select member*</InputLabel>
                                    <Select
                                        sx={{ minWidth: "100%", width: "100%" }}
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        label="Select Teamlead *"
                                        multiple
                                        value={projectMembers.membersName}
                                        onChange={(e) => handelChange(e, "members")}
                                        placeholder="Select Members"
                                        renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value.split("_")[0]} />
                                            ))}
                                        </Box>}
                                    // MenuProps={MenuProps}
                                    >
                                        {members.length && members?.map((option) => {
                                            return (

                                                <MenuItem key={option._id} value={option.firstName + "_" + option._id} data-name={option._id} >
                                                    <ListItemIcon>
                                                        <Checkbox checked={projectMembers?.membersId?.indexOf(option._id) > -1} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={option.firstName} />
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>

                            </Box>

                        </DialogContent>
                        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
                                updateSingleProject("modifymembers")
                            }}>
                                Update
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>

                    {/* modal3 */}

                    <BootstrapDialog
                        onClose={() => closeModal("modal3")}
                        aria-labelledby="customized-dialog-title"
                        open={modals.modal3}
                        sx={{ ".css-1t1j96h-MuiPaper-root-MuiDialog-paper": { width: "100%" } }}
                    >
                        <BootstrapDialogTitle id="customized-dialog-title" className="text-center"  >
                            Modify Leaders
                        </BootstrapDialogTitle>
                        <DialogContent sx={{
                            display: "flex", justifyContent: "center", flexDirection: "column",
                            overflowY: "auto"
                        }}>

                            {userRole() === "Admin" ? (
                                <Box sx={{ m: ".5rem 0", ".css-1t1j96h-MuiPaper-root-MuiDialog-paper": { width: "100% !important" } }}>
                                    <FormControl fullWidth >
                                        <InputLabel id="demo-multiple-chip-label">Select Supervisor*</InputLabel>
                                        <Select
                                            sx={{ minWidth: "100%", width: "100%" }}
                                            labelId="demo-multiple-chip-label"
                                            id="demo-multiple-chip"
                                            label="Select Teamlead *"
                                            multiple
                                            value={projectSuperVisor.supervisorName}
                                            onChange={(e) => handelChange(e, "supervisor")}
                                            placeholder="Select Members"
                                            renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value.split("_")[0]} />
                                                ))}
                                            </Box>}
                                        // MenuProps={MenuProps}
                                        >
                                            {supervisor.length && supervisor?.map((option) => {
                                                return (

                                                    <MenuItem key={option._id} value={option.firstName + "_" + option._id} data-name={option._id} >
                                                        <ListItemIcon>
                                                            <Checkbox checked={projectSuperVisor?.supervisorId?.indexOf(option._id) > -1} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={option.firstName} />
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>

                                </Box>
                            ) : null}


                            <Box sx={{ m: ".5rem 0", ".css-1t1j96h-MuiPaper-root-MuiDialog-paper": { width: "100% !important" } }}>
                                <FormControl fullWidth >
                                    <InputLabel id="demo-multiple-chip-label">Select Team leads*</InputLabel>
                                    <Select
                                        sx={{ minWidth: "100%", width: "100%" }}
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        label="Select Teamlead *"
                                        multiple
                                        value={projectTeamLead.teamLeadName}
                                        onChange={(e) => handelChange(e, "teamlead")}
                                        placeholder="Select Team leads"
                                        renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value.split("_")[0]} />
                                            ))}
                                        </Box>}
                                    // MenuProps={MenuProps}
                                    >
                                        {teamLead.length && teamLead?.map((option) => {
                                            return (

                                                <MenuItem key={option._id} value={option.firstName + "_" + option._id} data-name={option._id} >
                                                    <ListItemIcon>
                                                        <Checkbox checked={projectTeamLead?.teamLeadId?.indexOf(option._id) > -1} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={option.firstName} />
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>

                            </Box>

                        </DialogContent>
                        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained"
                                dis
                                sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
                                    updateSingleProject("modifyleader")
                                }}>
                                Update
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>

                </Box>


            )}
        </>
    )

}




export default SubProjectDetail;
