import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { BigPlayButton, Player } from 'video-react';
import "video-react/dist/video-react.css"; // import css
import axios from 'axios';
const VideoPlayer = ({videoPath}) => {
    const [videoUrl, setVideoUrl] = useState("");
    // assets/videos/course/video1499867005.mp4
    // async function getVideo() {
    //   const requestData = {
    //     "knowledgeShareId": "663ca4312065fb030b2bf427",
    //     "priority": "primary"
    //   }
  
    //   try {
    //     const reqrestUrl = await axios.post(`${process.env.REACT_APP_URL}/knowledge/video`, requestData, {
    //       headers: {
    //         "Content-Type": "application/json",
    //         // "Authorization": "Bearer " + token,
  
    //       }
    //     })
  
    //     if(reqrestUrl.status === 200){
    //       const responseData = reqrestUrl.data
    //       console.log(responseData);
    //       setVideoUrl(responseData.result)
  
    //     }
  
  
    //   }catch(err){
  
    //   }
    // }
    // useEffect(() => {
    //   getVideo()
    // }, [])
    return (
        <div style={{ width: "100%", padding:".3rem", backgroundColor: "black", borderRadius: "10px" }}>
          <Player
            playsInline
            poster="https://scottfortunoff.com/wp-content/uploads/2018/12/video_icon-768x693.jpg"
            src={videoPath}
            // src={videoUrl}
            
  
          >
                  <BigPlayButton position="center" />
            </Player>
  
        </div>
    )
}

export default VideoPlayer