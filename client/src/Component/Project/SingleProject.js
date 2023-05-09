
import React from 'react'
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
import { Box, Divider, Stack, Paper, AvatarGroup } from '@mui/material';

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
const SingleProject = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    // <Box sx={{marginLeft:{sm:'30px',md:"280px"}}}>
    <Card sx={{ maxWidth: 345 }}>
      <StyledCardHeader
      sx={{cursor: "pointer"}}
      onClick={()=> {
        alert("clicked");
      }}
        
        action={()=>{
          console.log("hello");
        }}
        title="Project One"
        
        
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
          <Typography color={"GrayText"}>2023/01/01</Typography>
        </div>
        <div className='p-2'>
        <Typography>Dead Line</Typography>
          <Typography color={"GrayText"}>2023/01/01</Typography>
        </div>
      </Stack>
      <div className='p-2'>
        <Typography>Supervisor</Typography>
        <Avatar src='https://cdn-icons-png.flaticon.com/512/21/21104.png' />
      </div>
      <div className='p-2'>
        <Typography>Leader</Typography>
        <Avatar src='https://cdn-icons-png.flaticon.com/512/21/21104.png' />
      </div>
      <div className='p-2'>
        <Typography>Members</Typography>
        <AvatarGroup total={7} sx={{textAlign: "left"}}>
          <Avatar alt="Remy Sharp" src="https://cdn-icons-png.flaticon.com/512/21/21104.png" />
          <Avatar alt="Travis Howard" src="https://cdn-icons-png.flaticon.com/512/21/21104.png" />
          <Avatar alt="Agnes Walker" src="https://cdn-icons-png.flaticon.com/512/21/21104.png" />
          <Avatar alt="Trevor Henderson" src="https://cdn-icons-png.flaticon.com/512/21/21104.png" />
        </AvatarGroup>

      </div>
      <Divider />
      {/* <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions> */}
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse> */}
    </Card>

//   </Box>
  );
}

export default SingleProject