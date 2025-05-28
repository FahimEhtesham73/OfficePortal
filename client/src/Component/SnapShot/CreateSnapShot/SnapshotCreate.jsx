import { Box } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';


import StepperSnap from './Shared/StepperSnap'
import StepOne from './Stepcard/StepOne/StepOne'
import StepTwoInfoOne from './Stepcard/StepTwo/StepTwoInfoOne';
import StepTwoInfoTwo from './Stepcard/StepTwo/StepTwoInfoTwo';
import StepThreeInfoOne from './Stepcard/stepThree/StepThreeInfoOne';
import StepFourInfoOne from './Stepcard/stepFour/StepFourInfoOne';
import StepFourInfoTwo from './Stepcard/stepFour/StepFourInfoTwo';
import StepFourInfoThree from './Stepcard/stepFour/StepFourInfoThree';
import StepFourInfoFour from './Stepcard/stepFour/StepFourInfoFour';
import StepFourInfoFive from './Stepcard/stepFour/StepFourInfoFive';
import StepFourInfoSix from './Stepcard/stepFour/StepFourInfoSix';

const SnapshotCreate = () => {

    const stepValue = useSelector((state) => state.snapshot.stepperLevel)
    const nextStepValue = useSelector((state) => state.snapshot.nextStepValue)

    const checkStep = () => {
        switch(nextStepValue){
            case 'step_1': return <StepOne />
            case 'step_2_info_1': return <StepTwoInfoOne />
            case 'step_2_info_2': return <StepTwoInfoTwo />
            case 'step_3_info_1': return <StepThreeInfoOne />
            case 'step_4_info_1': return <StepFourInfoOne />
            case 'step_4_info_2': return <StepFourInfoTwo />
            case 'step_4_info_3': return <StepFourInfoThree />
            case 'step_4_info_4': return <StepFourInfoFour />
            case 'step_4_info_5': return <StepFourInfoFive />
            case 'step_4_info_6': return <StepFourInfoSix />
        }
    }

    const renderStep = () => {
        return (
            <>
                {checkStep()}
            </>
        )
    }
    return (
        <>
            <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px", maxWidth: '2618px' }}>
                <StepperSnap level={stepValue} />
                {renderStep()}
            </Box>
        </>
    )
}

export default SnapshotCreate