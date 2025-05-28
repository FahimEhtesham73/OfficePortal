import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, TextField, FormControlLabel, Checkbox, Button, Typography, Box, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { increment, nextStep, snapShotApplicantAnswers } from '../../../../../store/slices/SnapshotSlice';
import { toast } from 'react-toastify';

const StepOne = () => {
    const dispatch = useDispatch();

    const [projects, setProjects] = useState({
        projectName: "",
        projectCode: "",
        projectDescription: ""
    })

    const handleChange = (e) => {
        let name = e.target.name
        let value = e.target.value
        setProjects({
            ...projects,
            [name]:value
        })
    }

    return (
        <>
            <Card sx={{ maxWidth: 800, margin: 'auto', mt: 5, p: 2 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Left Side */}
                        <Grid item xs={12} sm={4} md={3} container direction="column">
                            <Typography variant="h6" gutterBottom>
                                Step 1
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Please provide the project details
                            </Typography>
                            <Divider orientation="horizontal" flexItem sx={{ margin: '0 16px' }} />
                        </Grid>

                        {/* <Divider orientation="horizontal" flexItem sx={{ margin: '0 16px' }} /> */}

                        {/* Right Side */}
                        <Grid item xs={12} sm={8} md={9}>
                            <Box component="form" noValidate autoComplete="off">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                            label="Project name"
                                            defaultValue=""
                                            name='projectName'
                                            value={projects.projectName}
                                            helperText="14/50 character limit"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                        onChange={handleChange}
                                            required
                                            fullWidth
                                            label="Project code"
                                            defaultValue=""
                                            name='projectCode'
                                            value={projects.projectCode}
                                            helperText="Enter project code"
                                        />
                                        {/* <FormControlLabel
                                        control={<Checkbox name="codeUnavailable" color="primary" />}
                                        label="Project code unavailable"
                                    /> */}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                        onChange={handleChange}
                                            fullWidth
                                            label="Project description (optional)"
                                            multiline
                                            rows={4}
                                            name='projectDescription'
                                            value={projects.projectDescription}
                                            // helperText="500 character limit"
                                        />
                                    </Grid>
                                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                                        <Button variant="contained" color="primary" onClick={() => {
                                            if(projects.projectName && projects.projectCode){
                                                dispatch(nextStep('step_2_info_1'))
                                                dispatch(increment())
                                                dispatch(snapShotApplicantAnswers(projects))
                                            }else{
                                                toast.warning("Fill all the required fields", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                                            }
                                        }}>
                                            Next
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default StepOne