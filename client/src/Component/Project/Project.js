import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import SingleProject from "./SingleProject";
import Cookies from "js-cookie";
import { getAllProject } from "../../api/projectApi";

const Project = () => {
  const jwt = Cookies.get("_token");
  const [allProject, setAllProject] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getProjects() {
    try {
      let response = await getAllProject("", jwt);
      let data = await response.json();
      console.log(data);
      setAllProject(data.data);
    } catch (e) {
      console.log("somenthin went wrong", e);
    }
  }
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <Box sx={{ marginLeft: { sm: "30px", md: "280px" }, display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "40px", maxWidth: "2618px" }}>
<Grid container  spacing={3}>
      {allProject?.length &&
        allProject.map((p) => {
          console.log(p);
          return (
            <Grid item xs={12} sm={6} md={3} >
            
            <SingleProject project = {p} />
            
            </Grid>
          );
        })}
        </Grid>
    </Box>
  );
};

export default Project;
