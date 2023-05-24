
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
import { Box, Divider, Stack, Paper, AvatarGroup, Tooltip } from '@mui/material';
import { getAllProject } from '../../api/projectApi';
import { useNavigate } from 'react-router-dom';

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
 ".MuiCardHeader-title" : {
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



const SingleProject = ({project}) => {
  console.log(project);

  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [modals, setModals] = useState({
    editProjectModal: false,
    addMemberMoal: false
  })

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // useEffect(()=> {
  //   getAllProject("", )
  // },[])
  return (
    // <Box sx={{marginLeft:{sm:'30px',md:"280px"}}}>
    <div className='p-2'>
    <Card  elevation={'4'} sx={{  width: '100%', padding: "1rem"}}>
      <StyledCardHeader
      sx={{cursor: "pointer"}}
      onClick={()=> {
        navigate(`${project._id}`)
      }}
        
        action={()=>{
        }}
        title={project.projectName}
        
        
      />
      <Divider />
      
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {project.projectDescription}
        </Typography>
      </CardContent>
      <Stack spacing={{ xs: 1, sm: 2 }} direction="row" justifyContent={"space-between"} useFlexGap flexWrap="wrap">
        <div className='p-2'>
          <Typography color={"CaptionText"}>Started</Typography>
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
          {project?.projectSuperVisorDetails.map((m)=> {
            return (
        <Tooltip title={m.firstName}>
            <Avatar alt={m?.firstName} src={m?.imagePath} />
        </Tooltip>
            )
          })}
          </Stack>
      </div>
      <div className='p-2'>
        <Typography>Leader</Typography>
        <Stack direction="row" spacing={2}>
          {project?.projectLeadDetails.map((m)=> {
            return (
        <Tooltip title={m.firstName}>
            <Avatar alt={m?.firstName} src={m?.imagePath} />
        </Tooltip>
            )
          })}
          </Stack>

      </div>
      <div className='p-2'>
        <Typography>Members</Typography>

        <AvatarGroup total={project.projectMembersList.length} sx={{display: "flex", justifyContent: "left"}}>
          {project.projectMembersList.map((m)=> {
            return (
              <Tooltip title={`${m.firstName}`}>
                <Avatar alt="profile-img" src={m.imagePath} />

              </Tooltip>

            )

          })}
          
        </AvatarGroup>

      </div>
      <Divider />
      
    </Card>

    </div>

//   </Box>
  );
}

export default SingleProject