import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { increment, nextStep, updateProgress, teamPlusAnswers, resetSnapShotInfo, snapShotApplicantAnswers } from '../../../../../store/slices/SnapshotSlice';
import { useNavigate } from 'react-router-dom';

const WithTeamPlusQuestions = (OriginalComponent) => {
    const WrappedComponent = (props) => {
        const navigate = useNavigate()
        const [selectedStatement, setSelectedStatement] = useState('')
        const { nextStatementNum } = props

        const dispatch = useDispatch()

        const handleChange = (cardLabel) => {
            // console.log({ cardLabel });
            setSelectedStatement(cardLabel);
        };

        const handleSubmit = (event) => {
            dispatch(updateProgress())
            nextStatementNum === 'done' && dispatch(increment())
            nextStatementNum === 'done' && dispatch(resetSnapShotInfo())
            nextStatementNum === 'done' && navigate('/snap-dashboard')
            dispatch(snapShotApplicantAnswers({ applicantAns: [selectedStatement] }))
            dispatch(nextStep(`step_4_info_${nextStatementNum}`))
        };

        return (
            <OriginalComponent
                {...props}
                selectedStatement={selectedStatement}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
            />
        );
    };

    return WrappedComponent;
};

export default WithTeamPlusQuestions;