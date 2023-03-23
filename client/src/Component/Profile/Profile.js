import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import imageSrc from '../../images/saimom.jpg'
import { TextField } from '@mui/material';


// const useStyles = makeStyles((theme) => ({
//     root: {
//       display: 'flex',
//       flexDirection: 'column',
//       marginBottom: theme.spacing(2),
//       [theme.breakpoints.up('sm')]: {
//         flexDirection: 'row',
//       },
//     },
//     media: {
//       minWidth: 150,
//       height: 150,
//       marginRight: theme.spacing(2),
//       [theme.breakpoints.down('sm')]: {
//         minWidth: '100%',
//         height: 'auto',
//         marginBottom: theme.spacing(2),
//         marginRight: 0,
//       },
//     },
//     divider: {
//       margin: theme.spacing(2, 0),
//       [theme.breakpoints.down('sm')]: {
//         margin: theme.spacing(0, 2),
//         transform: 'rotate(90deg)',
//       },
//     },
//   }));


const Profile = () => {
    // const classes = useStyles();
    return (
        <>
         <div class="page-wrapper">
            <div class="content container-fluid">

                <div class="page-header">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3 class="page-title">Profile</h3>
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="profile-view">
                                    <div class="profile-img-wrap">
                                        <div class="profile-img">
                                            <a href="#"><img alt=""
                                                    src={imageSrc}/></a>
                                        </div>
                                    </div>
                                    <div class="profile-basic">
                                        <div class="row">
                                            <div class="col-md-5">
                                                <div class="profile-info-left">
                                                    <h3 class="user-name m-t-0 mb-0">MD. Saimom Islam</h3>
                                                    <small class="text-muted">Full Stack Software Engineer</small>
                                                    <div class="staff-id">Employee ID : 100032</div>
                                                    <div class="small doj text-muted">Date of Join : 1st Jan 2022</div>

                                                </div>
                                            </div>
                                            <div class="col-md-7">
                                                <ul class="personal-info">
                                                    <li>
                                                        <div class="title">Phone:</div>
                                                        <div class="text"><a href="#">01521400864</a></div>
                                                    </li>
                                                    <li>
                                                        <div class="title">Email:</div>
                                                        <div class="text"><a href="#"><span class="__cf_email__"
                                                                    >saimom@nextsolutionlab.com</span></a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="title">Birthday:</div>
                                                        <div class="text">8th September</div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pro-edit"><a data-bs-target="#profile_info" data-bs-toggle="modal"
                                            class="edit-icon" href="#"><i class="fa fa-pencil"></i></a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-content">

                    <div id="emp_profile" class="pro-overview tab-pane fade show active">
                        {/* Personal Information  and Emergency Contact*/}
                        <div class="row">
                            <div class="col-md-12 d-flex">
                                <div class="card profile-box flex-fill">
                                    <div class="card-body">
                                        <h3 class="card-title">Personal Informations <a href="#" class="edit-icon"
                                                data-bs-toggle="modal" data-bs-target="#personal_info_modal"><i
                                                    class="fa fa-pencil"></i></a></h3>
                                        <ul class="personal-info">
                                            
                                            <li>
                                                <div class="title">Phone</div>
                                                <div class="text"><a href="#">01521400864</a></div>
                                            </li>
                                            <li>
                                                <div class="title">Nationality</div>
                                                <div class="text">Bangladeshi</div>
                                            </li>
                                            <li>
                                                <div class="title">Religion</div>
                                                <div class="text">islam</div>
                                            </li>
                                            <li>
                                                <div class="title">Marital status</div>
                                                <div class="text">Single</div>
                                            </li>
                                            <li>
                                                <div class="title">Blood Group</div>
                                                <div class="text">A+</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* <div class="col-md-6 d-flex">
                                <div class="card profile-box flex-fill">
                                    <div class="card-body">
                                        <h3 class="card-title">Emergency Contact <a href="#" class="edit-icon"
                                                data-bs-toggle="modal" data-bs-target="#emergency_contact_modal"><i
                                                    class="fa fa-pencil"></i></a></h3>
                                        <h5 class="section-title">Primary</h5>
                                        <ul class="personal-info">
                                            <li>
                                                <div class="title">Name</div>
                                                <div class="text">John Doe</div>
                                            </li>
                                            <li>
                                                <div class="title">Relationship</div>
                                                <div class="text">Father</div>
                                            </li>
                                            <li>
                                                <div class="title">Phone </div>
                                                <div class="text">9876543210, 9876543210</div>
                                            </li>
                                        </ul>
                                        <hr/>
                                        <h5 class="section-title">Secondary</h5>
                                        <ul class="personal-info">
                                            <li>
                                                <div class="title">Name</div>
                                                <div class="text">Karen Wills</div>
                                            </li>
                                            <li>
                                                <div class="title">Relationship</div>
                                                <div class="text">Brother</div>
                                            </li>
                                            <li>
                                                <div class="title">Phone </div>
                                                <div class="text">9876543210, 9876543210</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        {/* Expertise And Goal Setting */}
                        <div class="row">
                           
                            <div class="col-md-6 d-flex">
                                <div class="card profile-box flex-fill">
                                    <div class="card-body">
                                        <h3 class="card-title">Expertise <a href="#" class="edit-icon"
                                                data-bs-toggle="modal" data-bs-target="#education_info"><i
                                                    class="fa fa-pencil"></i></a></h3>
                                        <div class="experience-box">
                                            <ul class="experience-list">
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Front End Development</a>
                                                            <div>React,Javascript</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Back End Development</a>
                                                            <div>NodeJs,Express, MongoDB</div>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Tool</a>
                                                            <div>Figma, Postman</div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 d-flex">
                                <div class="card profile-box flex-fill">
                                    <div class="card-body">
                                        <h3 class="card-title">Goal Setting<a href="#" class="edit-icon"
                                                data-bs-toggle="modal" data-bs-target="#education_info"><i
                                                    class="fa fa-pencil"></i></a></h3>
                                        <div class="experience-box">
                                            <ul class="experience-list">
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Cloud Knowledge</a>
                                                            <div>AWS</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Deep Learning Basic</a>
                                                            
                                                        </div>
                                                    </div>
                                                </li>

                                                
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Education And Experience */}
                        <div class="row">
                            <div class="col-md-6 d-flex">
                                <div class="card profile-box flex-fill">
                                    <div class="card-body">
                                        <h3 class="card-title">Education Informations <a href="#" class="edit-icon"
                                                data-bs-toggle="modal" data-bs-target="#education_info"><i
                                                    class="fa fa-pencil"></i></a></h3>
                                        <div class="experience-box">
                                            <ul class="experience-list">
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Ahsanullah University Of Science And Technology</a>
                                                            <div>Bsc Computer Science</div>
                                                            <span class="time">2016-2021</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Hajerataju degree College</a>
                                                            <div>HSC</div>
                                                            <span class="time">2014-2016</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Chittagong Govt. High School</a>
                                                            <div>SSC</div>
                                                            <span class="time">2009-2014</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 d-flex">
                                <div class="card profile-box flex-fill">
                                    <div class="card-body">
                                        <h3 class="card-title">Experience <a href="#" class="edit-icon"
                                                data-bs-toggle="modal" data-bs-target="#experience_info"><i
                                                    class="fa fa-pencil"></i></a></h3>
                                        <div class="experience-box">
                                            <ul class="experience-list">
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Full Stack Developer(NodeJS) at CoreDevs ltd.</a>
                                                            <span class="time">Sep 2021 - December 2021</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="experience-user">
                                                        <div class="before-circle"></div>
                                                    </div>
                                                    <div class="experience-content">
                                                        <div class="timeline-content">
                                                            <a href="#/" class="name">Full Stack Software Engineer at nextsolutionlab</a>
                                                            <span class="time">Jan 2022 - Present</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Leave Setting */}
                        <div class="row">
                            <div class="col-md-12 d-flex">
                                <div class="card profile-box flex-fill">
                                    <div class="card-body">
                                        <h3 class="card-title">Leave Setting <a href="#" class="edit-icon"
                                                data-bs-toggle="modal" data-bs-target="#personal_info_modal"><i
                                                    class="fa fa-pencil"></i></a></h3>
                                        <ul class="personal-info">
                                            
                                            <li style={{display:"flex",alignItems:"center",}}>
                                                <div class="title">Annual Casual Leave</div>
                                                <TextField id="outlined-search" label="11" type="search" disabled />
                                            </li>
                                            <li style={{display:"flex",alignItems:"center",}}>
                                                <div class="title">Annual Sick Leave</div>
                                                <TextField id="outlined-search" label="7" type="search" disabled />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                   

                </div>
            </div>

        </div>
        </>
       
    )
}

export default Profile


