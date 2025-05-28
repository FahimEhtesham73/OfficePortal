import React from 'react'
import { Avatar, Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { deepOrange, deepPurple } from '@mui/material/colors';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { useNavigate } from 'react-router-dom';
const Gallery = ({allBlog}) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();
    function truncateWithEllipsis(text, maxLength) {
        if (text.length <= maxLength) {
          return text;
        } else {
          return text.substring(0, maxLength - 3) + "...";
        }
      }
    return (
        <>
        
        <Grid container spacing={2} justifyContent={isSmallScreen && 'center'} >
            {
                 allBlog.map(v => (                    
                    <Grid item >
                    <Card sx={{ maxWidth: 250 }}>
                        <CardActionArea onClick={()=> navigate(`/knowledge_shareing/${v._id}`)} >
                            <CardMedia
                                sx={{width: 250, height: 200}}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCi_rZ7pjwa47iKJbsoFMWLkvtBKWwFWgybzAZXpd3F7bJvciYxvpFu-1ULBgXgmdopI&usqp=CAU"
                                title="green iguana"
                            />
                            <CardContent >
                                <Typography title={v.title} gutterBottom variant="h5" component="div">
                                    {truncateWithEllipsis(v.title, 20)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {/* Lizards are a widespread group of squamate reptiles, with over 6,000
                                    species, ranging across all continents except Antarctica */}
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Stack direction="row" spacing={2}>
                                    {/* <Tooltip title="Shuvo">
                                        <Avatar>S</Avatar>
                                    </Tooltip> */}
                                </Stack>

                            </CardContent>
                        </CardActionArea>

                    </Card>
                    </Grid>
                )) 
            }
        </Grid>
            {/* <Button > See More</Button> */}

            </>
    )
}

export default Gallery