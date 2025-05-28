
import { createSlice } from '@reduxjs/toolkit';
import userInfo from '../../Component/Hook/useUseInfo';

export const snapShotSlice = createSlice({
    name: 'snapshot',
    initialState: {
        nextStepValue: 'step_1',
        stepperLevel: 0,
        teamPlusAnswerProgress: 16.67,
        snapShotAnswers: {
            applicantId: "",
            projectName: "",
            projectCode: "",
            projectDescription: "",
            receiverId: "",
            startDate: "",
            endDate: "",
            totalHours: "",
            applicantAns: [],
            receiverAns: [],
            checkinDuration: "",
            selectedTeamLeaderName: "",
        }
    },
    reducers: {
        increment: (state) => {
            state.stepperLevel += 1;
        },
        nextStep: (state, action) => {
            state.nextStepValue = action.payload;
        },
        updateProgress: (state) => {
            state.teamPlusAnswerProgress = state.teamPlusAnswerProgress + 16.67
        },
        // teamPlusAnswers: (state, action) => {
        //     state.teamPlusAnswers = state.teamPlusAnswerStatement.push(action.payload)
        // },
        snapShotApplicantAnswers: (state, action) => {
            const propertyName = Object.getOwnPropertyNames(action.payload)
            // console.log(action.payload);
            propertyName.forEach((val) => {
                // console.log({val}, action.payload[val], typeof(action.payload[val]));
                if(Array.isArray(action.payload[val]) === true){
                    state.snapShotAnswers = { ...state.snapShotAnswers, [val]: [...state.snapShotAnswers[val], ...action.payload[val]] }
                }else{
                    state.snapShotAnswers = { ...state.snapShotAnswers, [val]: action.payload[val] }
                }
            })
            // console.log(state.snapShotAnswers);
        },
        resetSnapShotInfo: (state) => {
            state.nextStepValue = 'step_1'
            state.stepperLevel = 0
            state.teamPlusAnswerProgress = 16.67
            // state.teamPlusAnswerStatement = []
        }
    },
});

export const { increment, nextStep, updateProgress, resetSnapShotInfo, snapShotApplicantAnswers } = snapShotSlice.actions;

export default snapShotSlice.reducer;
