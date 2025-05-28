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


import { useDispatch } from 'react-redux';
import { nextStep } from '../../../../../store/slices/SnapshotSlice';
import WithTeamPlusQuestions from './WithTeamPlusQuestions';
import OptionCard from '../../Shared/OptionCard';

const StepFourInfoOne = () => {

    return (
       <OptionCard statement={'1. I am comfortable being myself on this team'} nextStatementNum={2}/>
    )
}

export default WithTeamPlusQuestions(StepFourInfoOne)