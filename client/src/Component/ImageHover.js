import React, { useState } from 'react';
import { Avatar, Button, Popover, Typography } from '@mui/material';
import {useTheme} from "@material-ui/core"


function ImageHover() {
    const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'upload-avatar-popover' : undefined;

  const avatarStyle = {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  };

  const popoverStyle = {
    padding: theme.spacing(2),
  };

  const handleUpload = () => {
    // Handle the upload logic here
  };

  return (
    <>
    <Avatar
    style={avatarStyle}
    alt="User Avatar"
    src="/path/to/avatar-image.jpg"
    onMouseEnter ={handleAvatarClick}
  />

  <Popover
    id={popoverId}
    open={open}
    anchorEl={anchorEl}
    onClose={handlePopoverClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
  >
    <div style={popoverStyle}>
      <Typography>Upload new avatar</Typography>
      {/* <Button variant="contained" color="primary" onClick={handleUpload}> */}
        <input type="file" />
      {/* </Button> */}
      <button > submit </button>
      
      {/* Add more upload options as needed */}
    </div>
  </Popover>
</>
    
  );
}

export default ImageHover;
