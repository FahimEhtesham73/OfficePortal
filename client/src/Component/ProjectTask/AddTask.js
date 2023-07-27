import React, { useEffect, useState } from 'react'
import Rodal from 'rodal'
import "rodal/lib/rodal.css";
import styles from './AddTaskModal.module.css'
import { Box, Checkbox, Chip, FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import { taskTypes } from './ProjectTask';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import userInfo from '../Hook/useUseInfo';
import { createProjectTaskApi } from '../../api/projectApi';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export const taskStatus = ['open', 'doing', 'pause', 'done'];
export const priorityStat = ['high', 'medium', 'low']

const AddTaskModal = ({ visible, onClose, handleCardAdd, status, projectCode, membersNameId, task, setTask, setAllTask, allTask, pageNumber,filterTask }) => {
    const jwt = Cookies.get("_token")
    const customStyles = {
        // background: "rgb(58 58 58)",
        padding: "20px",
        width: "50%",
        top: "5rem",
        height: "fit-content",
        maxWidth: "40rem",
        maxHeight: "38rem",
        overflowY: "scroll",
        
    }

    const user = userInfo();
    const [newTaskData, setNewTask] = useState({})




    const addTask = async () => {
        try {

            const data = {
                projectCode,
                status: status.toLowerCase(),
                taskName: task.taskName,
                startTime: task.startTime,
                endTime: task.endTime,
                totalHour: task.totalHour,
                additionalNotes: task.additionalNotes,
                assignedMembers: task.assignedMembers,
                priority: task.priority,
                progress: task.progress,
                taskType: task.taskType

            }
            const response = await createProjectTaskApi(data, jwt);
            const newTask = await response.json();
            if (response.status === 200) {
                setTask({...task, 
                    taskName: "",
                    startTime: "",
                    endTime: "",
                    status: "",
                    totalHour: "",
                    additionalNotes: "",
                    assignedMembers: [],
                    assignedMembersNameId: [],
                    priority: "",
                    progress: "",
                    taskType: ""
                })
                setNewTask(newTask.data[0])

                filterTask(pageNumber,[])
                // handleCardAdd(status, newTask.data[0])
                toast.success("Task Added", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    pauseOnHover: false,
                });
                onClose(true)
            }
            else {
                toast.warning("Task not added" || "No Update", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    pauseOnHover: false,
                });
            }
        } catch (err) {

        }
    }

    return (
        <Rodal customStyles={customStyles}  visible={visible} onClose={onClose}>
            <div className={styles.container} style={{ margin: "1rem 0",  }}>
                <TextField sx={{ width: "100%", m: "1",  ".MuiOutlinedInput-root ": { width: "100%" } }} type="text" label="Task Name" placeholder="Task" className={styles.input} value={task.taskName} onChange={(e) => setTask({
                    ...task,
                    taskName: e.target.value
                })} />

                {/* types selection */}
                <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: "50%" }}>
                        {/* <span className={styles.label}>Type</span> */}
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Type*</InputLabel>

                            <Select
                                // sx={{ width: "100%" }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // size="small"
                                label="Select Type"
                                value={task?.taskType}
                                onChange={(e) => {
                                    setTask({ ...task, taskType: e.target.value })
                                }}
                            >
                                {taskTypes.map((v, i) => (
                                    <MenuItem key={i} value={v} >{v}</MenuItem>
                                ))

                                }

                            </Select>
                        </FormControl>
                    </div>

                    <div style={{ width: "50%" }}>

                        {/* <span className={styles.label}>Type</span> */}
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Priority</InputLabel>

                            <Select
                                // sx={{ width: "100%" }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={task?.priority}
                                label="Select Priority*"
                                onChange={(e) => {
                                    setTask({
                                        ...task,
                                        priority: e.target.value
                                    })
                                }}
                            >
                                {priorityStat.length && priorityStat.map((v, i) => (
                                    <MenuItem key={i} value={v} >{v}</MenuItem>
                                ))

                                }

                            </Select>
                        </FormControl>
                    </div>

                </Box>




                {/* start - end time */}
                <Box sx={{ minWidth: 120, m: ".5rem 0", display: { xs: "inline-block", sm: "flex" }, justifyContent: "space-between", flexDirection: {
                    sm: "column", md: "row"
                } }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}  >
                        <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem", } }} >
                            <DatePicker label="Start Time *" slotProps={{
                                textField: {
                                    error: false,
                                },
                            }}
                                value={dayjs(task.startTime)}

                                onChange={(e) => {
                                    if (e?.['$d']) {
                                        setTask({
                                            ...task,
                                            startTime: new Date(e?.['$d'])
                                        })

                                    }
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem" } }} >
                            <DatePicker label="End Time *" slotProps={{
                                textField: {
                                    error: false
                                    // error: ((task.startTime && task.endTime) && (new Date(task.startTime <= new Date(task.endTime)))) && true,
                                },
                            }}
                                value={dayjs(task.endTime)}

                                onChange={(e) => {
                                    if (e?.['$d']) {

                                        setTask({
                                            ...task,
                                            endTime: new Date(e?.['$d'])
                                        })
                                    }
                                }}

                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>

                {/* approx hour  & assigned members*/}
                <Box sx={{ display: { xs: "block", md: "flex" }, alignItems: "end", justifyContent: "space-between", margin: {gap: {sm: "10px"}}}}>
                    <Box sx={{ width: { xs: "100%", md: "45%" } }}>
                        <TextField label="Total hour" type="text" placeholder="Total hour" className={styles.input} value={task.totalHour} onChange={(e) => {

                            let val = e.target.value.replace(/[^0-9]/g, '');
                            setTask({

                                ...task,
                                totalHour: val
                            })
                        }
                        }
                        />

                    </Box>

                    <Box sx={{ width: { xs: "100%", md: "45%" }, marginTop: {xs: "10px", md: "0"} }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Assign To</InputLabel>

                            <Select
                                // sx={{ width: "100%" }}
                                disabled={(user?.role?.name === "admin" || user?.role?.name === "projectlead" || user?.role?.name === "teamlead") ? false : true}


                                value={task.assignedMembersNameId}
                                multiple
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // size="small"
                                label="Select Type"
                                onChange={(e) => {
                                    let mappedValue = e.target.value.map((val) => val.split("_")[0]);

                                    setTask({ ...task, assignedMembersNameId: e.target.value, assignedMembers: mappedValue })
                                }}
                                renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value.split("_")[1]} />
                                    ))}
                                </Box>}
                            >
                                {membersNameId?.length && membersNameId?.map((option) => {
                                    return (

                                        <MenuItem key={option._id} value={option?._id + "_" + option?.firstName}  >
                                            <ListItemIcon>
                                                <Checkbox checked={task.assignedMembers?.indexOf(option._id) > -1} />
                                            </ListItemIcon>
                                            <ListItemText primary={option?.firstName} />
                                        </MenuItem>
                                    )
                                })}

                            </Select>
                        </FormControl>
                    </Box>


                </Box>

                <Box sx={{ display: { xs: "block", md: "flex" }, alignItems: "end", justifyContent: "space-between", }}>
                    <Box sx={{ width: { xs: "100%", md: "45%" } }}>
                        <FormControl sx={{ width: "100%" }} >
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>

                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // size="small"
                                disabled

                                placeholder='Select status'
                                value={task?.status}
                                label="Status"

                                onChange={(e) => {

                                    setTask({
                                        ...task,
                                        status: e.target.value
                                    })
                                }}
                            >
                                {taskStatus.length && taskStatus.map((v, i) => (
                                    <MenuItem key={i} value={v} >{v.toUpperCase()}</MenuItem>
                                ))

                                }

                            </Select>
                        </FormControl>

                    </Box>

                    {/* <Box sx={{ width: { xs: "100%", md: "45%" } }}>
                        <TextField label="Progess" type="text" placeholder="Progress" className={styles.input} value={task.progress} 
                        disabled={(task.status === "doing" || task.status === 'pause')? false: true}
                        onChange={(e) => 
                        {
                            
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        
                        if(task.status === "doing"){
                            setTask({
    
                                ...task,
                                progress: val
                            })} 

                        }
                    }
                        />

                    </Box> */}
                </Box>









                <div>
                    <span className={styles.label}>Additional notes</span>
                    <textarea
                        sx={{
                            ".MuiOutlinedInput-root ": { width: "100%" }
                        }}
                        rows={5} className={styles.input} value={task.additionalNotes}
                        type="text" onChange={(e) => setTask({ ...task, additionalNotes: e.target.value })}
                        placeholder="What you wish to do?" />
                </div>

                <button
                    // disabled={title === "" && detail === ""}
                    className={styles.saveButton}
                    onClick={() => {
                        addTask()
                        // handleCardAdd(status, newTaskData)

                    }}
                >
                    Add
                </button>
            </div>
        </Rodal>
    )
}

export default AddTaskModal