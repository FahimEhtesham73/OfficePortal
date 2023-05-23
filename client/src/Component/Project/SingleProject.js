
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
          console.log("hello");
        }}
        title={project.projectName}
        
        
      />
      <Divider />
      
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
      <Stack spacing={{ xs: 1, sm: 2 }} direction="row" justifyContent={"space-between"} useFlexGap flexWrap="wrap">
        <div className='p-2'>
          <Typography color={"CaptionText"}>Started</Typography>
          <Typography color={"GrayText"}>{project.projectStartTime}</Typography>
        </div>
        <div className='p-2'>
        <Typography>Dead Line</Typography>
          <Typography color={"GrayText"}>{project.projectEndTime}</Typography>
        </div>
      </Stack>
      <div className='p-2'>
        <Typography>Supervisor</Typography>
        <Tooltip title={project.projectSuperVisorDetails.firstName}>
        <Avatar alt={project.projectSuperVisorDetails.firstName} src={project?.projectSuperVisorDetails?.imagePath} />

        </Tooltip>
      </div>
      <div className='p-2'>
        <Typography>Leader</Typography>
        <Tooltip title={project.projectLeadDetails.firstName}>
        <Avatar alt={project.projectLeadDetails.firstName} src={project?.projectLeadDetails?.imagePath} />

        </Tooltip>
      </div>
      <div className='p-2'>
        <Typography>Members</Typography>

        <AvatarGroup total={project.projectMembersList.length} sx={{textAlign: "left"}}>
          {/* {project.projectMembersList.map((m)=> {
            
            <Avatar alt="Remy Sharp" src={m.imagePath} />

          })} */}
          
        </AvatarGroup>

      </div>
      <Divider />
      
    </Card>

    </div>

//   </Box>
  );
}

export default SingleProject