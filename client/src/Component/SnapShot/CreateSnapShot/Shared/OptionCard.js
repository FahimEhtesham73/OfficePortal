import React from 'react'

import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    RadioGroup,
    FormControl,
    LinearProgress,
    Divider,
    Button,
} from '@mui/material';
import WithTeamPlusQuestions from '../Stepcard/stepFour/WithTeamPlusQuestions';
import { useSelector } from 'react-redux';

const OptionCard = ({ statement, handleSubmit,
    handleChange,selectedStatement
 }) => {

    const statementArray = useSelector((state) => state.snapshot.teamPlusAnswerStatement)
    const progress = useSelector((state) => state.snapshot.teamPlusAnswerProgress)

    // console.log({selectedStatement}, {value});

    return (
        <>
            <Card sx={{ maxWidth: 800, margin: 'auto', mt: 5, p: 2 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Left Side */}
                        <Grid item xs={12} sm={4} md={3} container direction="column">
                            <Typography variant="h6" gutterBottom>
                                Step 4
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                What’s it like working on this team? Please answer the following six Team Pulse questions.
                            </Typography>
                            <Divider orientation="horizontal" flexItem sx={{ margin: '16px 0' }} />
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="body2">{Math.round(progress)}% complete</Typography>
                        </Grid>

                        {/* Right Side */}
                        <Grid item xs={12} sm={8} md={9}>
                            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <Typography variant="h6" gutterBottom>
                                    {statement}

                                </Typography>
                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <RadioGroup aria-label="comfort" name="comfort" value={selectedStatement} onChange={handleChange}>
                                        <Grid container spacing={2}>
                                            {['disagree', 'partiallyAgree', 'agree', 'stronglyAgree', 'veryStronglyAgree'].map((label, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>

                                                    <Box sx={{ width: '100%' }}>
                                                        <Card
                                                            value={label}
                                                            sx={{
                                                                height: 250,
                                                                width: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                border: selectedStatement === label ? '2px solid blue' : '1px solid gray',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => handleChange(label)}
                                                        >
                                                            <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                                                                {label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1')}
                                                            </CardContent>
                                                        </Card>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </RadioGroup>
                                </FormControl>
                                <Box mt={2} display="flex" justifyContent="flex-end">
                                    <Button type="submit" variant="contained" color="primary">
                                        Next
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </>
    )
}

export default  WithTeamPlusQuestions(OptionCard)