
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Divider, Stack, Paper, AvatarGroup, Tooltip, DialogActions, Button, DialogTitle, Dialog, Menu, MenuItem } from '@mui/material';
import { deleteProjectApi, getAllProject } from '../../api/projectApi';
import { useNavigate } from 'react-router-dom';
import { profileImg } from '../functions/commonFunc';
import PropTypes from 'prop-types';
import userRole from '../Hook/userHook';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  ".MuiCardHeader-title": {
    fontSize: "1.2rem"
  }
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  // color: theme.palette.text.secondary,
  flexGrow: 1,
}));

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
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const SingleSubProject = ({ project, deleteHandler }) => {
  // console.log({project});

  const jwt = localStorage.getItem('_token');

  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [modalOpen, setModalOpen] = useState(false)

  const [modals, setModals] = useState({
    editProjectModal: false,
    addMemberMoal: false
  })

  const [anchorEl, setAnchorEl] = useState(null);
  // const [modalOpen, setModalOpen] = useState(false)
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    // console.log(event);
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // For Modal open
  const handleClickOpen = () => {
    setModalOpen(true);
  };
  // For Modal Close
  const handleClickClose = () => {
    setModalOpen(false);
  };

  const settings = ['Delete Project'];


  const menu = (
    <Menu
      sx={{ mt: '45px' }}
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {settings.map((setting) => (
        <MenuItem key={setting} onClick={handleClose}>
          <Typography textAlign="center" onClick={handleClickOpen}>{setting}</Typography>
        </MenuItem>
      ))}
    </Menu>
  )

  // useEffect(()=> {
  //   getAllProject("", )
  // },[])

  // const deleteAProject = async()=> {
  //   try{
  //     const data = {projectId : project._id}
  //     const response = await deleteProjectApi(data, jwt);
  //     if(response.status === 200){
  //       console.log("delete", await response.json());
  //       navigate("/projects")
  //       toast.success("Project deleted successfully", {
  //         position: toast.POSITION.TOP_CENTER,
  //         autoClose: 1000,
  //         pauseOnHover: false,
  //     });
  //     }
  //     else{
  //       toast.warning("Something went wrong", {
  //         position: toast.POSITION.TOP_CENTER,
  //         autoClose: 2000,
  //         pauseOnHover: false,
  //     });
  //     }
  //   }catch(err){
  //     toast.warning("Something went wrong", {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 2000,
  //       pauseOnHover: false,
  //   });
  //   }
  // } 
  return (
    // <Box sx={{marginLeft:{sm:'30px',md:"280px"}}}>
    <div className='p-2'>
      <Card elevation={'4'} sx={{ width: '100%', padding: "1rem" }}>
        <StyledCardHeader
          sx={{ cursor: "pointer" }}
          // onClick={()=> {
          //   navigate(`${project._id}`)
          // }}

          action={
            userRole() === "Admin" && (

              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            )
          }
          title={<p onClick={() => {
            navigate(`${project.projectCode}`)

          }}> {project.projectName} </p>}


        />
        {menu}

        <Divider />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {/* Owner: {project?.projectOwner} */}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {project?.projectDescription.slice(0, 30)} {project?.projectDescription?.length > 30 ? "..." : ""}
          </Typography>
        </CardContent>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" justifyContent={"space-between"} useFlexGap flexWrap="wrap">
          <div className='p-2'>
            <Typography color={""}>Started</Typography>
            <Typography color={"GrayText"}>{new Date(project.projectStartTime).toDateString()}</Typography>
          </div>
          <div className='p-2'>
            <Typography>Dead Line</Typography>
            <Typography color={"GrayText"}>{new Date(project.projectEndTime).toDateString()}</Typography>
          </div>
        </Stack>
        <div className='p-2'>
          <Typography>Supervisor</Typography>
          <Stack direction="row" spacing={2}>
            {project?.projectSuperVisorDetails.map((m) => {
              return (
                <Tooltip title={m.firstName}>
                  <Avatar imgProps={{ crossOrigin: "false" }} alt={m?.firstName} src={profileImg(m?.imagePath)} />
                </Tooltip>
              )
            })}
          </Stack>
        </div>
        <div className='p-2'>
          <Typography>Leader</Typography>
          <Stack direction="row" spacing={2}>
            {project?.projectLeadDetails.map((m) => {
              return (
                <Tooltip title={m.firstName}>
                  <Avatar imgProps={{ crossOrigin: "false" }} alt={m?.firstName} src={profileImg(m?.imagePath)} />
                </Tooltip>
              )
            })}
          </Stack>

        </div>
        <div className='p-2'>
          <Typography>Members</Typography>

          <AvatarGroup total={project.projectMembersList.length} sx={{ display: "flex", justifyContent: "left" }}>
            {project.projectMembersList.map((m) => {
              return (
                <Tooltip title={`${m.firstName}`}>
                  <Avatar imgProps={{ crossOrigin: "false" }} alt="profile-img" src={profileImg(m.imagePath)} />

                </Tooltip>

              )

            })}

          </AvatarGroup>

        </div>
        <Divider />

      </Card>



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
          Are you sure want to Delete {project.projectName} project
        </BootstrapDialogTitle>
        {/* <Box>
                    
                </Box> */}
        <DialogActions sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>

          <Button variant="contained" color='error' sx={{ borderRadius: "50px", width: 150, bottom: 0 }} autoFocus onClick={() => {
            deleteHandler(project._id, project.projectCode)
            setModalOpen(false);
          }}>
            Yes
          </Button>
          <Button variant="contained" sx={{ borderRadius: "50px", width: 150, bottom: 0 }} autoFocus onClick={handleClickClose}>
            No
          </Button>
        </DialogActions>

      </BootstrapDialog>

    </div>

    //   </Box>
  );
}

export default SingleSubProject