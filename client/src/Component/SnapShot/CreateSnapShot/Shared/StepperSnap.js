import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
  'Project',
  'Team Leader',
  'Time',
  'Team Pulse'
];

export default function StepperSnap({level}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={level} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}