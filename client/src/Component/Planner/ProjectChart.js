import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Pie } from 'react-chartjs-2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Grid, FormControl, Select, InputLabel, MenuItem, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import Loading from 'react-loading';
import { red } from '@mui/material/colors';

const ProjectChart = ({ onProjectSelect, onSubProjectSelect, selectedProjectProps, renderTotalContributionTime, handleSubProjectSelect, formatTime, renderMonthWiseDetails, onSelection }) => {
    const [data, setData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date().toString())

    const jwt = localStorage.getItem('_token')
    const jwtUser = localStorage.getItem('_info')

    const getUserIdFromJwt = (token) => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded._id;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    };

    const userId = getUserIdFromJwt(jwt);
    // console.log("user", userId);
    var decoded
    var decodedUser
    if (jwt) {
        decoded = jwtDecode(jwt);
    } else {
        decoded = ''
    }

    if (jwtUser) {
        decodedUser = jwtDecode(jwtUser);
    } else {
        decodedUser = ''
    }

    const [selectedProject, setSelectedProject] = useState(null);
    const [isProjectView, setIsProjectView] = useState(true);
    const [pieChartSelect, setPieChartSelect] = useState(false)
    const [selectedYearMonth, setSelectedYearMonth] = useState(null);
    const [projectData, setProjectData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [showBackButton, setShowBackButton] = useState(false);

    const fetchData = useCallback(async (date) => {
        try {
            setLoading(true)
            const res = await fetch(`${process.env.REACT_APP_URL}/contribution/getplanner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt
                },
                body: JSON.stringify({
                    userId,
                    date: date
                }),
                credentials: 'include',
                withCredentials: true
            })
            const response = await res.json()

            setData(response);
            let formattedResponse = formatResponse(response)
            // console.log({ formattedResponse });
            setProjectData(formattedResponse)
            setChartData({
                labels: Object.keys(formattedResponse && formattedResponse),
                datasets: [
                    {
                        label: 'Working Hours',
                        data: Object.keys(formattedResponse).map(key => {
                            const totalContribution = formattedResponse[key].reduce((acc, detail) => acc + detail.totalContribution, 0);
                            return totalContribution;
                        }),
                        backgroundColor: Object.keys(formattedResponse).map((_, index) => `rgba(${index * 110}, ${120 - index * 50}, 100, 0.6)`),
                        borderColor: Object.keys(formattedResponse).map((_, index) => `rgba(${index * 250}, ${245 - index * 50}, 100, 1)`),
                        borderWidth: 1,
                    },
                ],
            })
            setLoading(false)


        } catch (error) {
            setLoading(false)
            console.error('Error fetching data:', error);

        }
    },[jwt,userId])

    const formatResponse = (response) => {
        // console.log("Enter format response");
        let arr = []
        response.reduce((acc, curr) => {
            const projectKey = `${curr.projectCode}`;
            if (!acc[projectKey]) {
                acc[projectKey] = [];
            }
            const totalContribution = curr.dateAndContribution.reduce((total, entry) => {
                const [hours, minutes] = entry.contribution.split(':').map(Number);
                return total + hours + minutes / 60;
            }, 0);
            acc[projectKey].push({
                projectCode: curr.projectCode,
                subProjectCode: curr.subProjectCode,
                totalContribution,
                month: curr.month,
                dateAndContribution: curr.dateAndContribution
            });
            arr = acc
            return acc;
        }, {})
        return arr
    }

    useEffect(() => {
        fetchData(currentDate);
    }, []);

    const searchedDate = (dateStr) => {

        const todayDate = new Date()
        const latestYear = todayDate.getFullYear()
        const latestMonth = todayDate.getMonth() + 1;
        const latestDate = todayDate.getDate()

        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const lastDateOfMonth = new Date(year, month, 0).getDate();

        let formattedDate
        if ((latestYear === year) && (latestMonth === month)) {
            formattedDate = `${year}-${month.toString().padStart(2, '0')}-${latestDate.toString().padStart(2, '0')}`;
        } else {
            formattedDate = `${year}-${month.toString().padStart(2, '0')}-${lastDateOfMonth.toString().padStart(2, '0')}`;
        }
        fetchData(formattedDate);
    }

    const [chartData, setChartData] = useState({});

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Project Contribution Pie Chart',
            },
        },
        onClick: (_, chartElements) => {
            if (chartElements && chartElements.length > 0) {
                setPieChartSelect(true)
                const clickedIndex = chartElements[0].index;
                if (isProjectView) {

                    const projectKey = projectData && Object.keys(projectData)[clickedIndex];
                    const details = projectData[projectKey];
                    setSelectedProject({ projectKey, details });
                    setIsProjectView(false);
                    setShowBackButton(true);

                    const subProjectColors = details.map((detail, index) => `rgba(${index * 110}, ${20 - index * 50}, 100, 0.6)`);
                    const subProjectBorders = details.map((_, index) => `rgba(${index * 250}, ${45 - index * 50}, 100, 1)`);
                    const updatedChartData = {
                        labels: details.map(detail => detail.subProjectCode),
                        datasets: [
                            {
                                label: 'Working Hours',
                                data: details.map(detail => detail.totalContribution),
                                backgroundColor: subProjectColors,
                                borderColor: subProjectBorders,
                                borderWidth: 1,
                            },
                        ],
                    };
                    setChartData(updatedChartData);
                    onProjectSelect({ projectKey, details });
                } else {
                    const projectKey = selectedProject.projectKey;
                    const details = selectedProject.details;
                    const subProjectCode = details[clickedIndex]?.subProjectCode;

                    if (subProjectCode) {
                        onSubProjectSelect(subProjectCode);
                    }
                }
            }
        },
    };


    const handleBackToProject = () => {
        setPieChartSelect(false);
        setIsProjectView(true);
        setShowBackButton(false);
        onSelection()
        setSelectedProject(null);
        setChartData({
            labels: Object.keys(projectData),
            datasets: [
                {
                    label: 'Working Hours',
                    data: Object.keys(projectData).map(key =>
                        projectData[key].reduce((acc, detail) => acc + detail.totalContribution, 0)
                    ),
                    backgroundColor: Object.keys(projectData).map((_, index) => `rgba(${index * 110}, ${120 - index * 50}, 100, 0.6)`),
                    borderColor: Object.keys(projectData).map((_, index) => `rgba(${index * 250}, ${245 - index * 50}, 100, 1)`),
                    borderWidth: 1,
                },
            ],
        });
    };

    return (
        isLoading ?
            <Loading />
            :
            <>

                <Box sx={{ width: { sm: "100%", xs: "100%", md: "75vw" }, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Planner</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "40px", maxWidth: '2168px' }}>
                        <Grid container spacing={5} >
                            <Grid item xs={12} sm={12} md={6} >
                                <Grid xs={12} sm={12} md={12} sx={{ marginBottom: "30px" }}>
                                    {!pieChartSelect && <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label={'Select Month and Year'}
                                            views={['month', 'year']}
                                            onChange={(e) => {
                                                if (e?.['$d']) searchedDate(e['$d']);
                                            }}
                                            sx={{ width: '100%' }}
                                        />
                                    </LocalizationProvider>}
                                </Grid>

                                <Grid xs={12} sm={12} md={12}>
                                    {!isLoading && <Pie data={chartData} options={options} height={350} width={350} />}
                                </Grid>

                                <div>{showBackButton && (
                                    <Button onClick={handleBackToProject} style={{ marginTop: '10px' }} variant="contained" color="primary">
                                        Back to Project
                                    </Button>
                                )}</div>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} >
                                {
                                    !pieChartSelect ? (
                                        <Box >
                                            <h2>Employee Project Contribution</h2>
                                            <TableContainer component={Paper} sx={{ maxHeight: '320px', overflowY: 'scroll', marginBottom: "10px" }}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow style={{ backgroundColor: '#e3e3e3' }}>
                                                            <TableCell style={{ fontWeight: 'bold' }}>Project Code</TableCell>
                                                            <TableCell style={{ fontWeight: 'bold' }}>Total Contribution</TableCell>
                                                            <TableCell style={{ fontWeight: 'bold' }}>Month</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            Object.keys(projectData).length > 0 ?
                                                                Object.keys(projectData).map((projectKey, index) => {
                                                                    const contributionsPerMonth = {};

                                                                    projectData[projectKey].forEach(project => {
                                                                        const { totalContribution, month } = project;
                                                                        if (!selectedYearMonth || month === selectedYearMonth) {
                                                                            if (!contributionsPerMonth[month]) {
                                                                                contributionsPerMonth[month] = 0;
                                                                            }
                                                                            contributionsPerMonth[month] += totalContribution;
                                                                        }
                                                                    });

                                                                    return Object.keys(contributionsPerMonth).map((month, idx) => (
                                                                        <TableRow key={`${projectKey}-${idx}`} style={{ backgroundColor: index % 2 === 0 ? '#3498db' : 'white' }}>
                                                                            {idx === 0 && (
                                                                                <TableCell rowSpan={Object.keys(contributionsPerMonth).length}>
                                                                                    {projectKey}
                                                                                </TableCell>
                                                                            )}
                                                                            <TableCell>{contributionsPerMonth[month].toFixed(2)}</TableCell>
                                                                            <TableCell>{month}</TableCell>
                                                                        </TableRow>
                                                                    ));
                                                                }) :
                                                                <TableRow>
                                                                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>No data to preview</TableCell>
                                                                </TableRow>
                                                        }

                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    ) :
                                        (
                                            <>
                                                <Grid xs={12} sm={12} md={12}>

                                                    {
                                                        selectedProjectProps ?
                                                            <div>
                                                                <h2>Project Details</h2>
                                                                <TableContainer component={Paper}>
                                                                    <Table>
                                                                        <TableHead>
                                                                            <TableRow style={{ backgroundColor: '#e3e3e3' }}>
                                                                                <TableCell style={{ fontWeight: 'bold' }}>Project Code</TableCell>
                                                                                <TableCell style={{ fontWeight: 'bold' }}>Sub Project Code</TableCell>
                                                                                <TableCell style={{ fontWeight: 'bold' }}>Total Contribution {renderTotalContributionTime()}</TableCell>
                                                                                <TableCell style={{ fontWeight: 'bold' }}>Month</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {

                                                                                selectedProjectProps?.details.map((detail, index) => (
                                                                                    <TableRow key={index} onClick={() => handleSubProjectSelect(detail.subProjectCode)}>
                                                                                        <TableCell>{detail.projectCode}</TableCell>
                                                                                        <TableCell>{detail.subProjectCode}</TableCell>
                                                                                        <TableCell>{formatTime(detail.totalContribution)}</TableCell>
                                                                                        <TableCell>{detail.month}</TableCell>
                                                                                    </TableRow>
                                                                                ))



                                                                            }
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                            </div>

                                                            :

                                                            <div>
                                                                <h2>Employee Project Contribution</h2>
                                                                <TableContainer component={Paper}>
                                                                    <Table>
                                                                        <TableHead>
                                                                            <TableRow style={{ backgroundColor: '#e3e3e3' }}>
                                                                                <TableCell style={{ fontWeight: 'bold' }}>Project Code</TableCell>
                                                                                <TableCell style={{ fontWeight: 'bold' }}>Total Contribution</TableCell>
                                                                                <TableCell style={{ fontWeight: 'bold' }}>Month</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {
                                                                                (
                                                                                    Object.keys(projectData).length > 0) ? (
                                                                                    Object.keys(projectData).map((projectKey, index) => {
                                                                                        const contributionsPerMonth = {};

                                                                                        projectData[projectKey].forEach(project => {
                                                                                            const { totalContribution, month } = project;
                                                                                            if (!selectedYearMonth || month === selectedYearMonth) {
                                                                                                if (!contributionsPerMonth[month]) {
                                                                                                    contributionsPerMonth[month] = 0;
                                                                                                }
                                                                                                contributionsPerMonth[month] += totalContribution;
                                                                                            }
                                                                                        });

                                                                                        return Object.keys(contributionsPerMonth).map((month, idx) => (
                                                                                            <TableRow key={`${projectKey}-${idx}`} style={{ backgroundColor: index % 2 === 0 ? '#3498db' : 'white' }}>
                                                                                                {idx === 0 && (
                                                                                                    <TableCell rowSpan={Object.keys(contributionsPerMonth).length}>
                                                                                                        {projectKey}
                                                                                                    </TableCell>
                                                                                                )}
                                                                                                <TableCell>{contributionsPerMonth[month].toFixed(2)}</TableCell>
                                                                                                <TableCell>{month}</TableCell>
                                                                                            </TableRow>
                                                                                        ));
                                                                                    })
                                                                                ) : (
                                                                                    ""
                                                                                    // console.log("Entered no data")
                                                                                    // <TableRow>
                                                                                    //     <TableCell colSpan={3} style={{ textAlign: 'center', color: red }}>No data to preview</TableCell>
                                                                                    // </TableRow>
                                                                                )
                                                                            }
                                                                        </TableBody>

                                                                    </Table>
                                                                </TableContainer>
                                                            </div>
                                                    }


                                                </Grid>
                                                <Grid xs={12} sm={12} md={12}>
                                                    {renderMonthWiseDetails}
                                                </Grid>
                                            </>
                                        )
                                }

                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </>
    );

};

export default ProjectChart;