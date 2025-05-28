import React, { useState } from 'react'
import {
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Typography,
    Divider,
    Box
} from '@mui/material';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { format, differenceInDays } from 'date-fns';
// import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import { useDispatch } from 'react-redux';
import { increment, nextStep, snapShotApplicantAnswers } from '../../../../../store/slices/SnapshotSlice';

const StepThreeInfoOne = () => {

    const [hours, setHours] = useState(0);
    const [duration, setDuration] = useState({
        startDate: "",
        endDate: ""
    })
    const dispatch = useDispatch()

    const handleDuration = (date) => {
        // console.log(date);
        let startDate = date[0]?.['$d']
        let endDate = date[1]?.['$d']

        setDuration({
            startDate,
            endDate
        })
        // console.log(startDate, endDate);
    }

    return (
        <>
            <Card sx={{ maxWidth: 1200, margin: 'auto', mt: 5, p: 2 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Left Side */}
                        <Grid item xs={12} sm={4} md={3} container direction="column">
                            <Typography variant="h6" gutterBottom>
                                Step 3
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Please provide project dates and hours worked
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ margin: '0 16px' }} />
                        </Grid>

                        {/* Vertical Divider */}


                        {/* Right Side */}
                        <Grid item xs={12} sm={8} md={9}>
                            {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
                            <Box component="form" noValidate autoComplete="off">
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DemoContainer components={['DateRangePicker']} >
                                                <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} onChange={(e) => {
                                                    // console.log(e);
                                                    handleDuration(e)
                                                }} />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    {/* <Grid item xs={6}>
                                            <DatePicker
                                                label="End Date"
                                                value={endDate}
                                                onChange={handleDateChange(setEndDate)}
                                                renderInput={(params) => <TextField fullWidth {...params} />}
                                            />
                                        </Grid> */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            How many hours were spent on this project during the selected time period?
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Please enter the total amount of hours you have worked for this project between the start and end date, in the field below.
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="Hours"
                                            value={hours}
                                            onChange={(e) => setHours(e.target.value)}
                                        // InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                                        <Button variant="contained" color="primary"
                                            onClick={() => {
                                                dispatch(increment())
                                                dispatch(snapShotApplicantAnswers(duration))
                                                dispatch(nextStep('step_4_info_1'))
                                            }}
                                        >
                                            Next
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                            {/* </LocalizationProvider> */}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default StepThreeInfoOne