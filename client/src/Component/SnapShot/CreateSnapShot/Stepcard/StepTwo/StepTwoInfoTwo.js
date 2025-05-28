import React, { useState } from 'react'
import {
    Card,
    CardContent,
    Grid,
    Button,
    Typography,
    Box,
    Divider,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    FormHelperText,
    FormControlLabel,
    Avatar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { increment, nextStep, snapShotApplicantAnswers } from '../../../../../store/slices/SnapshotSlice';
import { toast } from 'react-toastify';

const StepTwoInfoTwo = () => {
    const dispatch = useDispatch()
    const teamLeaderName = useSelector((state)=>state.snapshot.snapShotAnswers.selectedTeamLeaderName)

    const [checkinDuration, setCheckinDuration] = useState("")

    const handleChange = (e)=>{
        setCheckinDuration(e.target.value)
    }
    return (
        <Card sx={{ maxWidth: 900, margin: 'auto', mt: 5, p: 2 }}>
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

                    {/* Vertical Divider */}
                    

                    {/* Right Side */}
                    <Grid item xs={12} sm={8} md={9}>
                        <Box component="form" noValidate autoComplete="off">
                            <Typography variant="h6" gutterBottom>
                                Team Leader
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ mr: 2 }}>SK</Avatar>
                                <Box>
                                    <Typography variant="body1">{teamLeaderName}</Typography>
                                </Box>
                            </Box>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">How often did you check-in with {teamLeaderName} during this Snapshot period?</FormLabel>
                                <FormHelperText>Your response to this question is <strong>not shared with your Team Leader</strong></FormHelperText>
                                <RadioGroup aria-label="checkin-frequency" name="checkin-frequency" sx={{ mt: 1 }} onChange={handleChange}>
                                    <FormControlLabel value="weekly" control={<Radio />} label="Once or more per week" />
                                    <FormControlLabel value="biweekly" control={<Radio />} label="Every two weeks" />
                                    <FormControlLabel value="monthly" control={<Radio />} label="Once a month" />
                                    <FormControlLabel value="less-monthly" control={<Radio />} label="Less than once a month" />
                                    <FormControlLabel value="not-checked-in" control={<Radio />} label="I did not check-in with this Team Leader regularly (or at all)" />
                                </RadioGroup>
                            </FormControl>
                            <Grid item xs={12} display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                                <Button variant="contained" color="primary"
                                onClick={()=>{
                                    if(checkinDuration !== ""){
                                        dispatch(increment())
                                        dispatch(snapShotApplicantAnswers({checkinDuration}))
                                        dispatch(nextStep('step_3_info_1'))
                                    }else{
                                        toast.warning("Fill all the required fields", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
                                    }
                                }}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default StepTwoInfoTwo