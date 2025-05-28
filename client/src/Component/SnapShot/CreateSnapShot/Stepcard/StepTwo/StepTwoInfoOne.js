import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, TextField, FormControlLabel, Checkbox, Button, Typography, Box, Divider, FormControl, InputLabel, Select, Chip, ListItemText, ListItemIcon, MenuItem, Radio } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { nextStep, snapShotApplicantAnswers } from '../../../../../store/slices/SnapshotSlice';
import { getAllUserApi } from '../../../../../api/userApi';

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

const StepTwoInfoOne = () => {
    const jwt = localStorage.getItem('_token');
    const dispatch = useDispatch()
    

    const [projectTeamLead, setProjectTeamLead] = useState({
        teamLeadId: [],
        teamLeadName: [],
    })
    const [roles, setRoles] = useState([])
    const [teamLead, setTeamLead] = useState([])
    const [supervisor, setSuperVisor] = useState([])
    const [projectAdd, setProjectAdd] = useState({
        projectLead: "",
        projectLeadName: ""
    })

    const getRoles = async () => {
        try {
            let data = await getAllUserApi(jwt);
            if (data?.status === 200) {
                let resData = await data.json();

                setRoles(resData)
                if (resData.length) {
                    let teamLead = resData.filter((v, i) => v.roleDetails.name === "teamlead" || v.roleDetails.name === "projectlead");

                    setTeamLead(teamLead);
                }
            }
        } catch (e) {

        }
    }

    const handelChange = (e) => {
        // let mappedName = e.target.value.map((val)=> val.split("_")[0]);
        let mappedValue = e.target.value.split("_")[1]

        // console.log(mappedValue);
        setProjectAdd({ ...projectAdd, projectLead: mappedValue, projectLeadName: e.target.value.split("_")[0] })
    }

    useEffect(() => {
        getRoles()
    }, [])

    return (
        <Card sx={{ maxWidth: 800, margin: 'auto', mt: 5, p: 2 }}>
            <CardContent>
                <Grid container spacing={3}>
                    {/* Left Side */}
                    <Grid item xs={12} sm={4} md={3} container direction="column">
                        <Typography variant="h6" gutterBottom>
                            Step 2
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Who is your Team Leader on this project?
                        </Typography>
                        <Divider orientation="horizontal" flexItem sx={{ margin: '0 16px' }} />
                    </Grid>

                    {/* <Divider orientation="horizontal" flexItem sx={{ margin: '0 16px' }} /> */}

                    {/* Right Side */}
                    <Grid item xs={12} sm={8} md={9}>
                        <Box sx={{ width: "100%", m: ".5rem 0", display: { sm: "flex" }, justifyContent: "center", alignItems: "center" }}>
                            <FormControl sx={{ width: { xs: "100%", sm: "100%" } }}>
                                <InputLabel id="demo-multiple-checkbox-label">Select Team Lead*</InputLabel>
                                {/* Test */}
                                <Select
                                    labelId="demo-simple-select-label"
                                    label="Select Teamlead *"
                                    value={projectAdd.projectLeadName}
                                    onChange={(e) => handelChange(e, "teamlead")}
                                    placeholder="Select leam visor"
                                    renderValue={(selected) => selected.split("_")[0]}
                                    MenuProps={MenuProps}
                                >
                                    {teamLead && teamLead.map((option) => (
                                        <MenuItem key={option._id} value={option.firstName + "_" + option._id} data-name={option._id}>
                                            <ListItemIcon>
                                                <Radio checked={projectAdd.projectLeadName === option.firstName + "_" + option._id} />
                                            </ListItemIcon>
                                            <ListItemText primary={option.firstName} />
                                        </MenuItem>
                                    ))}

                                </Select>

                            </FormControl>
                        </Box>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={() => {
                                if (projectAdd.projectLead !== "") {
                                    dispatch(nextStep('step_2_info_2'))
                                    // dispatch(increment())
                                    dispatch(snapShotApplicantAnswers({ receiverId: projectAdd.projectLead, selectedTeamLeaderName: projectAdd.projectLeadName }))
                                }
                                else {
                                    toast.warning("Fill all the required fields", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                                }
                            }}>
                                Next
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default StepTwoInfoOne