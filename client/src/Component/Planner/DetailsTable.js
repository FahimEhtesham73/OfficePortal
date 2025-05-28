import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import ProjectChart from './ProjectChart';

function DetailsTable() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSubProject, setSelectedSubProject] = useState(null);

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setSelectedSubProject(null);
    };

    const handleSubProjectSelect = (subProjectCode) => {
        if (selectedProject) {
            const subProjectDetails = selectedProject.details.find(detail => detail.subProjectCode === subProjectCode);
            setSelectedSubProject(subProjectDetails);
        }
    };

    const renderTotalSubProjectContributionTime = () => {
        if (selectedSubProject) {
            const totalContribution = selectedSubProject.dateAndContribution.reduce((acc, entry) => {
                const [hours, minutes] = entry.contribution.split(':').map(Number);
                return acc + hours + minutes / 60;
            }, 0);
            return (
                <div>
                    <h5>({formatTime(totalContribution.toFixed(2))}) hours</h5>
                </div>
            );
        }
        return null;
    };


    const renderTotalContributionTime = () => {
        if (selectedProject) {
            const totalContribution = selectedProject.details.reduce((acc, detail) => acc + detail.totalContribution, 0);
            return (
                <div>
                    <h5>({formatTime(totalContribution)}) </h5>
                </div>
            );
        }
        return null;
    };

    const handleSelection=()=>{
        setSelectedProject(null);
        setSelectedSubProject(null)
    }

    const formatTime = (hours) => {
        const formattedHours = Math.floor(hours);
        const minutes = Math.round((hours - formattedHours) * 60);
        return `${formattedHours}h ${minutes}m`;
    };

    const renderMonthWiseDetails = useMemo(() => {
        if (selectedSubProject) {
            const monthWiseDetails = {};
            selectedSubProject.dateAndContribution.forEach(entry => {
                const [month, year] = entry.date.split('/');
                const key = `${month}-${year}`;
                if (!monthWiseDetails[key]) {
                    monthWiseDetails[key] = [];
                }
                monthWiseDetails[key].push(entry);
            });

            return (
                <Box sx={{ marginTop: "30px",marginBottom:"10px"}}>
                    <h2>Sub Project Details</h2>
                    <TableContainer component={Paper}  sx={{ maxHeight: '450px', overflowY: 'scroll' }}>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#e3e3e3' }}>
                                    <TableCell style={{ fontWeight: 'bold' }}>SubProject Code</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Total Contribution {renderTotalSubProjectContributionTime()}</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Month-Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(monthWiseDetails).map(month => (
                                    <TableRow key={month} >
                                        <TableCell>{selectedSubProject.subProjectCode}</TableCell>
                                        <TableCell>
                                            {formatTime(monthWiseDetails[month].reduce((acc, entry) => {
                                                const [hours, minutes] = entry.contribution.split(':').map(Number);
                                                return acc + hours + minutes / 60;
                                            }, 0))}
                                        </TableCell>
                                        <TableCell>{month}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            );
        }
        return null;
    },[selectedSubProject])


    return (
        <>
            <ProjectChart onProjectSelect={handleProjectSelect} onSubProjectSelect={handleSubProjectSelect} selectedProjectProps={selectedProject} renderTotalContributionTime={renderTotalContributionTime} handleSubProjectSelect={handleSubProjectSelect} formatTime={formatTime} renderMonthWiseDetails={renderMonthWiseDetails} onSelection={handleSelection}/>
        </>

    );
}

export default DetailsTable;
