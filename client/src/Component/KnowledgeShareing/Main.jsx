import React, { useEffect, useState } from 'react'
import axois from "axios"
import TextEditorLayout from './TextEditorLayout'
import {  Backdrop, Box, Button,  FormControl, IconButton, InputLabel, Menu, MenuItem, Select } from '@mui/material'
import { BigPlayButton, Player } from 'video-react';
import "video-react/dist/video-react.css"; // import css
import Gallery from './Gallery';
import { styled, alpha } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getAllCategory, getAllKnowledge } from '../../api/knowledgeShareApi';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
const KNOWLEDGECATEGORY = ['general', 'Course' ,'management']
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));
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


const Main = () => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, type) => {
    if(type === "knowledgeType"){
      setKnowledgeType(event.target.value)
    }else if(type === 'blog'){
      setBlogType(event.target.value);
    }
    else if( type === "category"){

    }
  };



  const [personName, setPersonName] = React.useState([]);
  const jwt = localStorage.getItem('_token');
  const  [allBlog, setAllBlog] = useState([]);
  const [currentAllBlog, setCurrentAllBlog] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [blogType, setBlogType] = useState("video")
  const [knowledgeType, setKnowledgeType] = useState("general");
  const [allCategory, setAllCategory] = useState([])
  const [openD,setOpenD] = useState(false)
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState(1);
  useEffect(()=> {
    fetchingAllData();
  },[blogType, knowledgeType])


  useEffect(()=> {
    fetchingAllCategory();
  },[])
  
  /**
   *  this function fetch all data and filter data from backend
   */
  const fetchingAllData = async () => {
    const requestParam = {
      filter: {
      knowledgeType:blogType,
      knowledgeCategory:knowledgeType
      
          },
      page: 1,
      limit: 10
      }
      // console.log(requestParam);
      try{
        const request = await getAllKnowledge(requestParam, jwt);
        if(request.status === 200){
          const response = request.data.result;
          setCurrentAllBlog(response);
          setAllBlog(response)
        }else if(request.status === 400){
          // console.log(request.data);
          throw new Error("Invalid request")

        }
        else if(request.status === 403){
          throw new Error("Access denied")
          
        }
        else{
          throw new Error("Network error")
        }
      }catch(err){
        console.log(err);
        toast.warning(err.message? err.message: "Something went wrong", { position: toast.POSITION.TOP_RIGHT, autoClose: 2000, pauseOnHover: false })

      }
    
  }
  /**
   * this function fetch the category list
   */
  const fetchingAllCategory = async() => {
    try{
      const request = await getAllCategory(jwt);
      if(request.status === 200){
        setAllCategory(request.data.result);
      }

    }catch(err){

    }
  }

  const toggleDrawer = (newOpen) => () => {
    setOpenD(newOpen);
  };

  return (
    <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px" }}>
      <Box sx={{display: "flex", justifyContent: "space-between", margin: "0 0 2rem 0", flexWrap: "wrap"}}>
         {/* video/ audio dropdown */}
      <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Blog Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={blogType}
          label="Blog Type"
          onChange={ (e)=>  handleChange(e, 'blog')}
        >
          <MenuItem value={"video"}>Video</MenuItem>
          <MenuItem value={"blog"}>Blog</MenuItem>
        </Select>
      </FormControl>
    </Box>
    {/* knowledge Category */}
    <div>
    <FormControl sx={{  width: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">Knowledge Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={knowledgeType}
          label="Knowledge Type"
          onChange={(e)=> handleChange(e, 'knowledgeType')}
        >
          <MenuItem value={"general"}>General</MenuItem>
          <MenuItem value={"management"}>Management</MenuItem>
          <MenuItem value={"course"}>Course</MenuItem>

        </Select>
      </FormControl>
    </div>

    {/* category filter  */}
    <div style={{display: "flex"}}>
    <FormControl sx={{  width: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={knowledgeType}
          label="Category"
          onChange={(e)=> handleChange(e, 'knowledgeType')}
        >
          <MenuItem value={"general"}>Science</MenuItem>
          <MenuItem value={"management"}>AI</MenuItem>
          <MenuItem value={"course"}>Machine Learning</MenuItem>

        </Select>
      </FormControl>
      
      <IconButton onClick={(e)=> {
        if(order === 1){
          setOrder(0)
        }
        else setOrder(1)
      }}>
        {order === 1 ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </IconButton>
    </div>


    <Button variant="contained" > <Link style={{color: "#fff"}} to={'/knowledge_shareing/controller'}>Admin Controller </Link> </Button>
      </Box>
      <Gallery allBlog={allBlog} />
      
    </Box>
  )
}

export default Main;