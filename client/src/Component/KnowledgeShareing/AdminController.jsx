import { Box, Input, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, OutlinedInput, ListItemText, TextareaAutosize as BaseTextareaAutosize, IconButton, Dialog, DialogTitle, DialogActions, ListItemIcon } from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useEffect, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { craeteCategory, createKnowledge, deleteFileFromLocaFilesytem, fileUpload, getAllCategory } from '../../api/knowledgeShareApi'
import AddIcon from '@mui/icons-material/Add';
import userInfo from '../Hook/useUseInfo';
import { getAllUserApi } from '../../api/userApi';
import { errorMessageToast, successMessageToast } from '../functions/commonFunc';
import { AxiosError } from 'axios';
const KNOWLEDGECATEGORY = ['general', 'Course', 'management']
const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

// Modal Styling
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        overflowY: 'revert',
        marginTop: '20px'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        overflowY: 'revert',
        marginTop: '20px'
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    {/* <CloseIcon /> */}
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};
const AdminController = () => {
    const navigate = useNavigate()
    const jwt = localStorage.getItem('_token');
    const userData = userInfo();

    const [title, setTitle] = useState('');
    const [courseType, setCourseType] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoriesIdAndName, setCategoriesIdAndName] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [type, setType] = useState("video");
    const [modalOpen, setModalOpen] = useState(false);
    const [apiCategoryName, setApiCategoryName] = useState("");
    const [users, setUsers] = useState([]);
    const [usersIdName, setUsersIdName] = useState([]);


    // For Modal open
    const handleClickOpen = () => {
        setModalOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setModalOpen(false);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleCourseTypeChange = (event) => {
        setCourseType(event.target.value);
    };

    const handleCategoryChange = (event) => {
        const newCategories = [...categories];
        if (event.target.checked) {
            newCategories.push(event.target.value);
        } else {
            const index = newCategories.indexOf(event.target.value);
            newCategories.splice(index, 1);
        }
        setCategories(newCategories);
    };

    const handleFileChange = async (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Form validation and data processing logic here

        const formData = new FormData();
        formData.append('title', title);
        formData.append('courseType', courseType);
        formData.append('categories', categories.join(','));
        formData.append('videoFile', selectedFile);
        formData.append('description', description);

        // Submit form data (e.g., using fetch API)
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCategoriesIdAndName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handelChangeAuthor = (event) => {
        const {
            target: { value },
        } = event;
        setUsersIdName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const getCategories = async () => {
        const all = await getAllCategory(jwt);
        if (all.status === 200) {
            setCategories(all.data.result)
        }
    }
    
    const addCategory = async () => {
        try {

            if (!apiCategoryName) {
                toast.warning("Name not entered", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }
            const cateGoryName = await craeteCategory(jwt, { categoryName: apiCategoryName });
            if (cateGoryName.status === 200) {
                setModalOpen(false);
                toast.success("New Category added", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnHover: false,
                });
                getCategories()
            } else if (cateGoryName.status === 400) {
                toast.warning(cateGoryName.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            } else {
                throw new Error("Something went wrong")
            }
        } catch (err) {
            toast.warning("Something went wrong", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    }


    const submitBlog = async () => {
        if (type === "video") {
            const requestBody = {
                // author: {name: }
            }
        }
    }
    const getUsers = async () => {
        try {
            let data = await getAllUserApi(jwt);
            if (data?.status === 200) {
                let resData = await data.json();
                // console.log(resData);

                setUsers(resData.map(v => ({ _id: v._id, firstName: v.firstName })))
                // console.log("res data", users);

            }
        } catch (e) {

        }
    }

    //file upload handler
 const fileUploads = async (filetype, knowledgeCategory, files) => {
        if (knowledgeCategory) {
            const formData = new FormData();
            formData.append("timestamps", new Date().getTime().toString());
            formData.append("knowledgeCategory", knowledgeCategory);
            formData.append("files", files);

            const response = await fileUpload(jwt, formData);
            // console.log(response);
            if (response.status === 200) {
                return response.data.result;
            }
            else {
                return response.data;
            }
        }
        else if (filetype) {
            const formData = new FormData();
            formData.append("timestamps", new Date().getTime().toString());
            formData.append("filetype", filetype);
            formData.append("files", files);

            const response = await fileUpload(jwt, formData);
            if (response.status === 200) {
                return response.data.result;
            } else {
                return response.data;

            }
        }
    }

    //blog creation handler
    const blogCreation = async () => {
        try {
            if (type === "video") {
                const fileInfo = await fileUploads("", courseType, selectedFile);
                // console.log({ fileInfo });
                const requestBody = {
                    "author": usersIdName.map(v => ({ name: v.split("_")[0], oId: v.split("_")[1] })),
                    "title": title,
                    "categories": categoriesIdAndName.map(v => ({ name: v.split("_")[1], oId: v.split("_")[0] })),
                    "knowledgeType": "video",
                    "knowledgeCategory": "general",
                    "filePath": fileInfo.filepath,
                    "description": description,
                    "fileType": fileInfo.fileType
                    // "thumbnailpath" : "/path/user",
                }

                const response = await createKnowledge(jwt, requestBody);
                if (response.status === 200) {
                    successMessageToast("Created successfully");
                    navigate("/knowledge_shareing")
                } else {

                    if (fileInfo?.filePath) {
                        await deleteFileFromLocaFilesytem(jwt, fileInfo.filePath);
                    }
                }
            }
            if (type === "blog") {
                const requestBody = {
                    "author": usersIdName.map(v => ({ name: v.split("_")[0], oId: v.split("_")[1] })),
                    "title": title,
                    "categories": categoriesIdAndName.map(v => ({ name: v.split("_")[1], oId: v.split("_")[0] })),
                    "knowledgeType": "blog",
                    "knowledgeCategory": "general",
                    "description": description,
                    // "thumbnailpath" : "/path/user",
                }

                const response = await createKnowledge(jwt, requestBody);
                if (response.status === 200) {
                    successMessageToast("Created successfully");
                    navigate("/knowledge_shareing");
                } else {


                }
            }



        } catch (err) {
            if (err instanceof AxiosError) {
                console.log(err);
                errorMessageToast(err?.response.data.message)
                return
            }
            errorMessageToast()
        }
    }



    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px" }}>
            <div className='button_section' style={{ display: "flex", justifyContent: "space-around", }}>
                <Button style={{ fontWeight: "bolder" }} onClick={() => setType("video")} variant={type === "video" ? 'contained' : "outlined"}>Video</Button>
                <Button style={{ fontWeight: "bolder" }} onClick={() => setType("blog")} variant={type === "blog" ? 'contained' : "outlined"}>Blog</Button>

            </div>
            <Box sx={{
                // display: "flex", justifyContent: "flex-start",
            }}>


                <div className='container'>
                    <form onSubmit={(e) => { e.preventDefault(); blogCreation() }} >
                        <TextField
                            label="Title"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="demo-simple-select-label" >Select author*</InputLabel>
                            <Select
                                multiple
                                labelId="demo-simple-select-label"
                                label="Select author*"
                                value={usersIdName}
                                onChange={(e) => handelChangeAuthor(e)}
                                placeholder="Author"
                                renderValue={(selected) => selected.map(v => v.split("_")[0]).join(", ")}
                                MenuProps={MenuProps}


                            >
                                {
                                    users && users.map((option, ind) => {
                                        return (
                                            <MenuItem key={option._id} value={option.firstName + "_" + option._id} data-name={option._id} >
                                                {/* <ListItemIcon>
                        <Checkbox checked={ u.indexOf(option._id) > -1} />
                      </ListItemIcon> */}
                                                <ListItemText primary={option.firstName} />
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="courseType-label">Course Type</InputLabel>
                            <Select
                                labelId="courseType-label"
                                id="courseType"
                                value={courseType}
                                onChange={handleCourseTypeChange}
                                label="Course Type"
                            >
                                {/* <MenuItem value="">Choose Type</MenuItem> */}
                                <MenuItem value={"general"}>General</MenuItem>
                                <MenuItem value={"management"}>Management</MenuItem>
                                <MenuItem value={"course"}>Course</MenuItem>
                            </Select>
                        </FormControl>
                        <div style={{ display: "flex", }}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="courseType-label">Category</InputLabel>
                                <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={categoriesIdAndName}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Category" />}
                                    renderValue={(selected) => selected.map(v => v.split("_")[1]).join(", ")}
                                    MenuProps={MenuProps}
                                >
                                    {categories.map((name) => (
                                        <MenuItem key={name._id} value={name._id + "_" + name.categoryName}>
                                            <ListItemText primary={name.categoryName} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <IconButton onClick={() => setModalOpen(true)} >
                                <AddIcon />
                            </IconButton>
                        </div>

                        

                        {
                            type === "video" && (<TextField
                                type="file"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                accept="video/*"
                                onChange={handleFileChange}
                                required
                            />)
                        }



                        <TextField aria-label="minimum height" value={description} onChange={handleDescriptionChange} fullWidth minRows={3} placeholder="Description" />

                        <br />
                        <Button disabled={ type === "video"? (title && usersIdName && courseType && type && selectedFile): (title && usersIdName && courseType ) ? false : true} sx={{ marginTop: "10px" }} variant="contained" type="submit" color="primary">
                            Save
                        </Button>
                    </form>

                </div>


            </Box>



            <BootstrapDialog
                onClose={handleClickClose}
                aria-labelledby="customized-dialog-title"
                open={modalOpen}
                PaperProps={{
                    sx: {
                        width: "40%",
                        height: 150,
                        display: "flex",
                        alignItems: "center"
                    }
                }}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleClickClose}>
                    Add new Category
                </BootstrapDialogTitle>
                <TextField
                    label="name"
                    variant="outlined"
                    margin="normal"
                    value={apiCategoryName}
                    onChange={(e) => setApiCategoryName(e.target.value)}
                    required
                />
                <DialogActions sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <Button disabled={apiCategoryName ? false : true} variant="contained" sx={{ borderRadius: "50px", width: 150, bottom: 0 }} autoFocus onClick={addCategory}>
                        Add
                    </Button>
                    <Button variant="contained" color='error' sx={{ borderRadius: "50px", width: 150, bottom: 0 }} autoFocus onClick={() => {
                        setModalOpen(false);
                    }}>
                        Cancel
                    </Button>

                </DialogActions>

            </BootstrapDialog>
        </Box>
    )
}

export default AdminController