import * as React from 'react';
import Box from '@mui/material/Box';
import VideoPlayer from './Player';
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { getSingleTaskApi } from '../../api/projectApi';
import userInfo from '../Hook/useUseInfo';
import Cookies from 'js-cookie';
import { deleteFileFromLocaFilesytem, deleteSingleKnowledgeApi, downloadFile, fileUpload, getSingleKnowledge, updateSingleKnowledgeShare } from '../../api/knowledgeShareApi';
import { FromPathTofileName, errorMessageToast, mappingFormatValue, successMessageToast, truncateWithEllipsis } from '../functions/commonFunc';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { AxiosError } from 'axios';
function SingleKnowledge() {
  let { id } = useParams();
  const navigate = useNavigate();
  // console.log(id);
  const jwt = localStorage.getItem('_token');
  const userData = userInfo();
  const [knowledge, setKnowledge] = React.useState({});
  const [othersFile, setOthersFile] = React.useState([]);
  const [mainVideoFilePath, setMainVideoFilePath] = React.useState("");
  



  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  /**
   * 
   * @param {String} videoUrlPath 
   * @returns 
   */

  const videoPathConverter = (videoUrlPath) => {
    if (videoUrlPath) {
      const pathSplitter = videoUrlPath?.split("/");
      const generatedPath = pathSplitter[pathSplitter.length - 2] + "/" + pathSplitter[pathSplitter.length - 1]
      return `${process.env.REACT_APP_VIDEOLOCATION}${generatedPath}`

    }
  }
  const getSingleUser = async () => {
    try {

      const response = await getSingleKnowledge(id, jwt);

      if (response.status === 200) {
        // console.log("respose", response.data.result);
        setKnowledge(response?.data?.result.knowledge)
        if (response?.data?.result?.allFiles.length) {
          setMainVideoFilePath(response?.data?.result?.allFiles.filter(v => v.priority === "primary")[0].link)
          setOthersFile(response?.data?.result?.allFiles?.filter(v=> v.priority !== "primary"));

        }
      }
      else {
        navigate(-1)
      }
    } catch (err) {
      console.log(err);
      navigate(-1)

    }
  }

  const deleteSingleKnowledge = async () => {
    try {

      const response = await deleteSingleKnowledgeApi(jwt, id);
      if (response.status === 200) {
        successMessageToast("Deleted Success fully");
        navigate("/knowledge_shareing")
      } else {
        errorMessageToast();

      }
    } catch (err) {
      errorMessageToast()
    }
  }

  React.useEffect(() => {
    getSingleUser();
  }, [id])
 

  const attachmentUpload =async (e)=> {
    try{
      const formData = new FormData();
            formData.append("timestamps", new Date().getTime().toString());
            formData.append("filetype", "others");
            formData.append("files", e.target.files[0]);

            const response = await fileUpload(jwt, formData);
            if (response.status === 200) {
                const req = await updateSingleKnowledgeShare(jwt, {
                  id: id,
                  command : "newAttachment",
                  newFilePath: response.data.result.filepath,
                  newFileType: response.data.result.fileType
                });
                if(req.status === 200){
                  successMessageToast("Uploaded successfully")
                  getSingleUser()
                }else{
                  errorMessageToast()
                }
            } else {
                // return response.data;
                errorMessageToast()

            }
    }catch(err){
      if(err instanceof AxiosError){
        errorMessageToast(err.response.data.message);
        return;
      }

      errorMessageToast()
    }
  }

  const attachmentDownload = async (id, name) => {
    try {
      const response = await downloadFile(jwt, id)

      if (response.status !== 200) {
        errorMessageToast()
      }

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  }

  const attachmentDelete = async (id) => {
    try {
      const response = await deleteFileFromLocaFilesytem(jwt, {fileMetaId: id})
      if(response.status === 200){
        successMessageToast("Successfully delete", 500)
        getSingleUser()
      }else{
      errorMessageToast()

      }
    } catch (error) {
      errorMessageToast()
    }
  }
  
  return (
    <Box sx={{ marginLeft: { sm: '60px', md: "280px", xs: "30px" }, marginRight: "30px" }}>
      <Box component={'div'} sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }
      }}>

        <Box component={'div'} style={{ flex: 2, width: "100%", }}>
          {knowledge?.knowledgeType === "video" ? <VideoPlayer videoPath={videoPathConverter(mainVideoFilePath)} /> : ""}
          <Box>
            <h3 style={{ padding: "1rem 0", fontWeight: "600", letterSpacing: "1.5px" }} component={'h3'}>Title: {knowledge?.title}</h3>
            <Box sx={{
              '&:first-letter': {
                textTransform: "uppercase"
              }
            }} >{knowledge?.description}</Box>
          </Box>
        </Box>
        <Box component={'div'} style={{ flex: 1, width: "100%", }}>
          <div style={{
            width: "80%",
            margin: "auto"
          }} >
            <Button variant='contained' fullWidth sx={{
              backgroundColor: "#cd1717",
              fontWeight: "600",
              "&:hover": {
                background: "#d32727"
              }

            }}
              endIcon={<DeleteIcon />}
              onClick={deleteSingleKnowledge}
            > Delete </Button>

          </div>
          <Box>
            <Box sx={{ backgroundColor: "#F3F3F3", margin: "auto", width: "80%", display: "flex", flexDirection: "column" }}>
              <div style={{ textAlign: "center" }}>
                Details
              </div>
              <div style={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                padding: "1rem"
              }}>
                <span>Authror: {knowledge?.author?.reduce((s, c, ind) => s += c.name + (ind < knowledge.author.length - 1 ? ', ' : ""), "")}</span>
                <span>Category: {knowledge?.categories?.reduce((s, c, ind) => s += c.name + (ind < knowledge.categories.length - 1 ? ', ' : ""), "")}</span>
                <span>Published: {new Date(knowledge?.createdAt).toLocaleString()}</span>

              </div>
            </Box>

            <Box sx={{ backgroundColor: "#F3F3F3", margin: "auto", width: "80%", display: "flex", flexDirection: "column", marginTop: "1rem" }}>
              <Box style={{ textAlign: "center", padding: "1rem", backgroundColor: "#87abd0", fontWeight: "bolder", letterSpacing: '1.5px' }} component={Paper}>
                Other's Attachments
                <Button
      component="label"
      role={undefined}
      variant=""
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      <VisuallyHiddenInput type="file" accept='.docx,.doc,.pptx,.ppt,.xlsx,.xls, .pdf'  onChange={(e)=> {
        attachmentUpload(e)
      }} />
    </Button>          
 </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Type</TableCell>
                      <TableCell align="right">Download</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {othersFile?.map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {truncateWithEllipsis(FromPathTofileName(row.link) , 20)}
                        </TableCell>
                        <TableCell align="right">{mappingFormatValue(row.fileType)}</TableCell>
                        <TableCell align="right"><CloudDownloadIcon sx={{cursor: "pointer"}} onClick = {(e)=> {
                          attachmentDownload(row._id, FromPathTofileName(row.link));
                        }} /></TableCell>
                        <TableCell align="right"><DeleteIcon sx={{cursor: "pointer"}} onClick={()=> attachmentDelete(row._id)} /></TableCell>


                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

          </Box>


        </Box>

      </Box>
    </Box>
  );
}

export default SingleKnowledge;
