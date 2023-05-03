import React, { useEffect, useState } from 'react'
import Loading from '../Hook/Loading/Loading.js';
import { useParams } from 'react-router-dom';
import userInfo from '../Hook/useUseInfo.js';

import imageSrc from '../../images/saimom.jpg'
import { Button, TextField, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { toast } from 'react-toastify';

// import { skillData } from '../../data/dummyData.js';
const skillData = [
    {
        _id: "1",
        title: "React JS",
        tools: "Frontend Engineering"
    },
    {
        _id: "2",
        title: "Node JS",
        tools: "Backend Engineering"
    }
]

const goalName = [
    {
        _id: "1",
        goalName: ["aws", "azure"],
        goalType: "Cloud Knowledge"
    },
    {
        _id: "2",
        goalName: ["Deep Learning",],
        goalType: "Machine Learning"
    }
]

const Profile = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({})
    const [cardEdit, setCardEdit] = useState({
        intro: false,
        personalInfo: false,
        expertise: false,
        goalSetting: false,
        eduInfo: false,
        experience: false,
        leaveSetting: false
    })

    const userInfoData = userInfo();

    const [intro, setIntro] = useState({
        personalPhone: "",
        nationality: "",
        religion: "",
        maritalStatus: "",
        bloodGroup: ""
    })
    const [expertField, setExpertField] = useState({
        title: "",
        tools: ""
    });

    const [goalSettingField, setgoalSettingField] = useState({
        goalName: "",
        goalType: ""
    })
    const [educationField, setEducationField] = useState({
        institution: "",
        location: "",
        endYear: "",
        startYear: "",
        degree: ""
    })

    const [experience, setExperience] = useState({
        company: "",
        location: "",
        title: "",
        startYear: "",
        endYear: ""
    })

    const [leaveSettings, setleaveSettings] = useState({
        casualLeave: "",
        sickLeave: ""
    })

    const [expertise, setExpertise] = useState([])
  
   

    let name
    let value

    const handleFields = (e, cardName) => {
        name = e.target.name
        value = e.target.value
        if (cardName === 'intro') {
            setIntro({ ...intro, [name]: value })
        }
        if (cardName === 'expert') {
            setExpertField({ ...expertField, [name]: value })
        }
    }

    const addExpertise = () => {
        console.log(expertise);
        setExpertise([...expertise, expertField])
        setExpertField({
            title: "",
            tools: ""
        })
    }
console.log("array of expertices", expertise);
    const getSingleUser = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/users/getsingleuser/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const data = await res.json()
        // console.log(data);
        const tempInfo = data[0]
        if (res.status === 200) {
            setUserData(data[0])
            setIntro({
                personalPhone: tempInfo?.personalPhone,
                nationality: tempInfo?.nationality,
                religion: tempInfo?.religion,
                maritalStatus: tempInfo?.maritalStatus,
                bloodGroup: tempInfo?.bloodGroup
            })
            // setExpertise(tempInfo?.expertise)
            setLoading(false)
        } else {
            setLoading(false)
            toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }

    }

    const updateUser = async (card) => {
        console.log("Card Name", card);
        var sentData
        if (card === 'intro') {
            sentData = intro
        }
        if (card === 'expertise') {
            sentData = {
                expertise
            }
        }
        const res = await fetch(`${process.env.REACT_APP_URL}/users/updateUser/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sentData)
        })
        const data = await res.json()
        console.log("user Data", data);
        if (res.status === 200) {
            setUserData(data)
        } else {

            toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
    }

    useEffect(() => {
        getSingleUser()
    }, [])

  
    return (

        loading ? <Loading /> :

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
                        {/* Intro */}
                        <div class="card mb-0">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="profile-view">
                                            <div class="profile-img-wrap">
                                                <div class="profile-img">
                                                    <a href="#"><img alt=""
                                                        src={userData?.imagePath} /></a>
                                                </div>
                                            </div>
                                            <div class="profile-basic">
                                                <div class="row">
                                                    <div class="col-md-5">
                                                        <div class="profile-info-left">
                                                            <h3 class="user-name m-t-0 mb-0">{userData?.firstName} {userData?.lastName}</h3>
                                                            <small >{userData?.designation?.name}</small>
                                                            <div class="staff-id">Employee ID : {userData?.empId}</div>
                                                            <div class="small doj ">Date of Join : {userData?.joiningDate?.split('T')[0]}</div>

                                                        </div>
                                                    </div>
                                                    <div class="col-md-7">
                                                        <ul class="personal-info">
                                                            <li>
                                                                <div class="title">Phone:</div>
                                                                <div >{userData?.personalPhone ? userData?.personalPhone : 'N/A'}</div>
                                                            </li>
                                                            <li>
                                                                <div class="title">Email:</div>
                                                                <div ><span class="__cf_email__"
                                                                >{userData?.email ? userData?.email : 'N/A'}</span>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="title">Birthday:</div>
                                                                <div >{userData?.birthDate ? userData?.birthDate : 'N/A'}</div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="pro-edit">
                                                {/* <a data-bs-target="#profile_info" data-bs-toggle="modal"
                                            class="edit-icon" href="#"></a> */}
                                                {(userInfoData?._id.toString() === id || userInfoData?.role.alias === "Admin") ?
                                                    <EditIcon onClick={() => { console.log("Clicked"); }} /> : ""}

                                            </div>
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
                                                <h3 class="card-title" >Personal Informations
                                                    {
                                                        (userInfoData?._id.toString() === id || userInfoData?.role.alias === "Admin") ? (!cardEdit.intro ?

                                                            <Tooltip title='Edit'>
                                                                <EditIcon className='edit-icon' onClick={() => { setCardEdit({ ...cardEdit, intro: true }) }} />
                                                            </Tooltip> :
                                                            <>
                                                                <Tooltip title='Save' sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon className='edit-icon' onClick={() => {
                                                                        updateUser('intro')
                                                                        setCardEdit({ ...cardEdit, intro: false })
                                                                    }} />
                                                                </Tooltip>
                                                                <Tooltip title="Cancel">
                                                                    <CancelIcon className='edit-icon'
                                                                        onClick={() => setCardEdit({ ...cardEdit, intro: false })}
                                                                    />
                                                                </Tooltip>

                                                            </>

                                                        ) : ""

                                                    }

                                                </h3>
                                                <ul class="personal-info">

                                                    <li>
                                                        <div class="title">Phone</div>
                                                        {
                                                            !cardEdit.intro ? <div >{userData?.personalPhone}</div> : <input type='text' name='personalPhone' value={intro.personalPhone} onChange={(e) => { handleFields(e, 'intro') }} />
                                                        }

                                                    </li>
                                                    <li>
                                                        <div class="title">Nationality</div>
                                                        {
                                                            !cardEdit.intro ? <div >{userData?.nationality}</div> : <input type='text' name='nationality' value={intro.nationality} onChange={(e) => { handleFields(e, 'intro') }} />
                                                        }
                                                    </li>
                                                    <li>
                                                        <div class="title">Religion</div>
                                                        {
                                                            !cardEdit.intro ? <div >{userData?.religion}</div> : <input type='text' name='religion' value={intro.religion} onChange={(e) => { handleFields(e, 'intro') }} />
                                                        }
                                                    </li>
                                                    <li>
                                                        <div class="title">Marital status</div>
                                                        {
                                                            !cardEdit.intro ? <div >{userData?.maritalStatus}</div> : <input type='text' name='maritalStatus' value={intro.maritalStatus} onChange={(e) => { handleFields(e, 'intro') }} />
                                                        }
                                                    </li>
                                                    <li>
                                                        <div class="title">Blood Group</div>
                                                        {
                                                            !cardEdit.intro ? <div >{userData?.bloodGroup}</div> : <input type='text' name='bloodGroup' value={intro.bloodGroup} onChange={(e) => { handleFields(e, 'intro') }} />
                                                        }
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Expertise And Goal Setting */}
                                <div class="row">

                                    <div class="col-md-6 d-flex">
                                        <div class="card profile-box flex-fill">
                                            <div class="card-body">
                                                <h3 class="card-title">Expertise
                                                    {/* <Tooltip title='Save'>
                                                        <SendIcon className='edit-icon' onClick={() => {
                                                            updateUser('expertise')
                                                        }} />
                                                    </Tooltip> */}
                                                    {(userInfoData?._id.toString() === id || userInfoData?.role.alias === "Admin") ?
                                                        <>
                                                            {cardEdit.expertise ? (
                                                                <>
                                                                    <Tooltip sx={{ marginLeft: "10px" }}>
                                                                        <SendIcon className='edit-icon' />
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <CancelIcon className='edit-icon'
                                                                            onClick={() => setCardEdit({ ...cardEdit, expertise: false })}
                                                                        />
                                                                    </Tooltip>
                                                                </>

                                                            ) : ""}
                                                            {!cardEdit.expertise && <Tooltip title='Edit' sx={{ marginLeft: "10px" }}>
                                                                <EditIcon className='edit-icon' onClick={() => { setCardEdit({ ...cardEdit, expertise: true }) }} />
                                                            </Tooltip>}
                                                        </>
                                                        : ""
                                                    }
                                                </h3>
                                                <div class="experience-box">

                                                    <ul class="experience-list">
                                                        {
                                                            skillData?.map((val, ind) => {
                                                                return (
                                                                    <>
                                                                    
                                                                        <li key={ind}>
                                                                        
                                                                            <div class="experience-user">
                                                                                <div class="before-circle"></div>
                                                                            </div>
                                                                            <div class="experience-content">
                                                                                {cardEdit.expertise && <Tooltip>
                                                                        <CancelIcon className='edit-icon' />
                                                                    </Tooltip>}
                                                                            
                                                                                <div class="timeline-content">
                                                                                    <a href="#/" class="name">{val?.title}</a>
                                                                                    <div>{val?.tools}</div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    </>


                                                                )
                                                            })
                                                        }

                                                    </ul>

                                                    {cardEdit.expertise && (<>

                                                        <input type="text" placeholder='Add Expertise Field Name' name="title" value={expertField.title} onChange={(e) => {
                                                            handleFields(e, 'expert')
                                                        }} />
                                                        <br />
                                                        <input type="text" placeholder='Add Stack Name' name="tools" style={{ marginTop: "10px", marginBottom: "10px" }} value={expertField.tools} onChange={(e) => {
                                                            handleFields(e, 'expert')
                                                        }} />
                                                        <br />
                                                        <Button variant='contained' onClick={() => { addExpertise() }}>Add</Button>
                                                    </>

                                                    )
                                                    }


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 d-flex">
                                        <div class="card profile-box flex-fill">
                                            <div class="card-body">
                                                <h3 class="card-title">Goal Setting
                                                    {(userInfoData?._id.toString() === id || userInfoData?.role.alias === "Admin") ?
                                                        <>
                                                            {cardEdit.goalSetting ? (
                                                                <>
                                                                    <Tooltip sx={{ marginLeft: "10px" }}>
                                                                        <SendIcon className='edit-icon' />
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <CancelIcon className='edit-icon'
                                                                            onClick={() => setCardEdit({ ...cardEdit, goalSetting: false })}
                                                                        />
                                                                    </Tooltip>
                                                                </>

                                                            ) : ""}
                                                            {!cardEdit.goalSetting && <Tooltip title='Edit' sx={{ marginLeft: "10px" }}>
                                                                <EditIcon className='edit-icon' onClick={() => { setCardEdit({ ...cardEdit, goalSetting: true }) }} />
                                                            </Tooltip>}
                                                        </>
                                                        : ""
                                                    }
                                                </h3>
                                                <div class="experience-box">
                                                    <ul class="experience-list">
                                                        <li>
                                                            <div class="experience-user">
                                                                <div class="before-circle"></div>
                                                            </div>
                                                            <div class="experience-content">
                                                            {cardEdit.goalSetting && <Tooltip>
                                                                        <CancelIcon className='edit-icon' />
                                                                    </Tooltip>}
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
                                                <h3 class="card-title">Education Informations {(userInfoData?._id.toString() === id || userInfoData?.role.alias === "Admin") ?
                                                    <>
                                                        {cardEdit.eduInfo ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>

                                                                    <SendIcon className='edit-icon' />
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <CancelIcon className='edit-icon'
                                                                        onClick={() => setCardEdit({ ...cardEdit, eduInfo: false })}
                                                                    />
                                                                </Tooltip>
                                                            </>

                                                        ) : ""}
                                                        {!cardEdit.eduInfo && <Tooltip title='Edit' sx={{ marginLeft: "10px" }}>
                                                            <EditIcon className='edit-icon' onClick={() => { setCardEdit({ ...cardEdit, eduInfo: true }) }} />
                                                        </Tooltip>}
                                                    </>
                                                    : ""
                                                }</h3>
                                                <div class="experience-box">
                                                    <ul class="experience-list">
                                                        <li>
                                                            <div class="experience-user">
                                                                <div class="before-circle"></div>
                                                            </div>
                                                            <div class="experience-content">
                                                            {cardEdit.eduInfo && <Tooltip>
                                                                        <CancelIcon className='edit-icon' />
                                                                    </Tooltip>}
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

                                                    {cardEdit.eduInfo && (<>

<input type="text" placeholder='Add Institution' name="institution" value={expertField.title} onChange={(e) => {
    handleFields(e, 'eduInfo')
}} />
<br />
<input type="date" placeholder='Add Start Year' name="startYear" style={{ marginTop: "10px", marginBottom: "10px" }} value={expertField.tools} onChange={(e) => {
    handleFields(e, 'eduInfo')
}} />
<br/>
<input type="date" placeholder='Add End Year' name="endYear" style={{ marginTop: "10px", marginBottom: "10px" }} value={expertField.tools} onChange={(e) => {
    handleFields(e, 'eduInfo')
}} />
<br />
<input type="text" placeholder='Degree' name="degree" value={expertField.title} onChange={(e) => {
    handleFields(e, 'eduInfo')
}} />
<br />
<input type="text" placeholder='Location' name="location" value={expertField.title} onChange={(e) => {
    handleFields(e, 'eduInfo')
}} />
<br />
<Button variant='contained' onClick={() => { addExpertise() }}>Add</Button>
</>

)
}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 d-flex">
                                        <div class="card profile-box flex-fill">
                                            <div class="card-body">
                                                <h3 class="card-title">Experience {(userInfoData?._id.toString() === id || userInfoData?.role.alias === "Admin") ?
                                                    <>
                                                        {cardEdit.experience ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon className='edit-icon' />
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <CancelIcon className='edit-icon'
                                                                        onClick={() => setCardEdit({ ...cardEdit, experience: false })}
                                                                    />
                                                                </Tooltip>
                                                            </>

                                                        ) : ""}
                                                        {!cardEdit.experience && <Tooltip title='Edit' sx={{ marginLeft: "-10px" }}>
                                                            <EditIcon className='edit-icon' onClick={() => { setCardEdit({ ...cardEdit, experience: true }) }} />
                                                        </Tooltip>}
                                                    </>
                                                    : ""
                                                }</h3>
                                                <div class="experience-box">
                                                    <ul class="experience-list">
                                                        <li>
                                                            <div class="experience-user">
                                                                <div class="before-circle"></div>
                                                            </div>
                                                            <div class="experience-content">
                                                            {cardEdit.experience && <Tooltip title='delete'>
                                                                        <CancelIcon className='edit-icon' />
                                                                    </Tooltip>}
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
                                                <h3 class="card-title">Leave Setting
                                                    {(userInfoData?.role.alias === "Admin") ?
                                                        <>
                                                            {cardEdit.leaveSetting ? (
                                                                <>
                                                                    <Tooltip sx={{ marginLeft: "10px" }}>
                                                                        <SendIcon className='edit-icon' />
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <CancelIcon className='edit-icon'
                                                                            onClick={() => setCardEdit({ ...cardEdit, leaveSetting: false })}
                                                                        />
                                                                    </Tooltip>
                                                                </>

                                                            ) : ""}
                                                            {!cardEdit.leaveSetting && <Tooltip title='Edit' sx={{ marginLeft: "-10px" }}>
                                                                <EditIcon className='edit-icon' onClick={() => { setCardEdit({ ...cardEdit, leaveSetting: true }) }} />
                                                            </Tooltip>}
                                                        </>
                                                        : ""
                                                    }

                                                </h3>
                                                <ul class="personal-info">

                                                    <li style={{ display: "flex", alignItems: "center", }}>
                                                        <div class="title">Annual Casual Leave</div>
                                                        <TextField id="outlined-search" label="11" type="search" disabled={cardEdit.leaveSetting ? false : true} />
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center", }}>
                                                        <div class="title">Annual Sick Leave</div>
                                                        <TextField id="outlined-search" label="7" type="search" disabled={cardEdit.leaveSetting ? false : true} />
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


