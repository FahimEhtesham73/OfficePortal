import React, { useEffect, useState } from "react";
import Loading from "../Hook/Loading/Loading.js";
import { useParams } from "react-router-dom";
import userInfo from "../Hook/useUseInfo.js";
import dayjs from "dayjs";
import imageSrc from "../../images/saimom.jpg";
import { Button, TextField, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { styled, MuiThemeProvider } from '@material-ui/core/styles';
import { red } from "@mui/material/colors";
import moment from "moment"

const Profile = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [cardEdit, setCardEdit] = useState({
        main: false,
        intro: false,
        personalInfo: false,
        skills: false,
        goalSetting: false,
        eduInfo: false,
        experience: false,
        leaveSetting: false,
    });

    const userInfoData = userInfo();

    // const [userMain, setUserMain] = useState({})
    const [intro, setIntro] = useState({
        personalPhone: "",
        nationality: "",
        religion: "",
        maritalStatus: "",
        bloodGroup: "",
    });
    const [skillFiled, setSkillField] = useState({
        title: "",
        tools: "",
    });

    const [goalSettingField, setGoalSettingField] = useState({
        goalName: "",
        goalType: "",
    });
    const [educationField, setEducationField] = useState({
        institution: "",
        location: "",
        endYear: "",
        startYear: "",
        degree: "",
    });

    const [experienceField, setExperienceField] = useState({
        company: "",
        location: "",
        title: "",
        startYear: "",
        endYear: "",
    });

    const [leaveSettings, setleaveSettings] = useState({
        casualLeave: "",
        sickLeave: "",
    });

    const [skills, setSkills] = useState([]);
    const [goals, setGoals] = useState([]);
    const [educations, setEducations] = useState([]);
    const [experinces, setExperiences] = useState([]);
    const [designation, setDesignation] = useState([])
    const [mainInfo, setMainInfo] = useState({
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
        designation: userData?.designation?._id,
        empId: userData?.empId,
        birthDate: userData?.birthDate,
        joiningDate: userData?.joiningDate,


    })

    console.log("dayjs", dayjs(mainInfo?.joiningDate));


    let name;
    let value;

    const handleFields = (e, cardName) => {
        name = e.target.name;
        value = e.target.value;
        if (cardName === "intro") {
            setIntro({ ...intro, [name]: value });
        }
        if (cardName === "expert") {
            setSkillField({ ...skillFiled, [name]: value });
        }
        if (cardName === "goal") {
            setGoalSettingField({ ...goalSettingField, [name]: value });
        }
        if (cardName === "eduInfo") {
            setEducationField({ ...educationField, [name]: value });
        }
        if (cardName === "experiences") {
            setExperienceField({ ...experienceField, [name]: value });
        }
        if (cardName === "main") {
            setMainInfo({ ...mainInfo, [name]: value })
        }
    };
    console.log("main", mainInfo);

    const addskills = () => {
        setSkills([...skills, skillFiled]);
        setSkillField({
            title: "",
            tools: "",
        });
    };
    const addGoals = () => {
        setGoals([...goals, goalSettingField]);
        setGoalSettingField({
            goalName: "",
            goalType: "",
        });
    };

    const addEducations = () => {
        setEducations([...educations, educationField]);
        setEducationField({
            institution: "",
            degree: "",
            startYear: "",
            endYear: "",
            location: ""
        });
    };
    const addExperineces = () => {
        setExperiences([...experinces, experienceField]);
        setExperienceField({
            title: "",
            company: "",
            startYear: "",
            endYear: "",
            location: ""
        });
    };
    const getSingleUser = async () => {
        setLoading(true);
        const res = await fetch(
            `${process.env.REACT_APP_URL}/users/getsingleuser/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await res.json();
        // console.log(data);
        const tempInfo = data[0];
        if (res.status === 200) {
            setUserData(data[0]);
            setIntro({
                personalPhone: tempInfo?.personalPhone,
                nationality: tempInfo?.nationality,
                religion: tempInfo?.religion,
                maritalStatus: tempInfo?.maritalStatus,
                bloodGroup: tempInfo?.bloodGroup,
            });
            setMainInfo({
                firstName: tempInfo?.firstName,
                lastName: tempInfo?.lastName,
                email: tempInfo?.email,
                designation: tempInfo?.designation?._id,
                empId: tempInfo?.empId,
                joiningDate: tempInfo?.joiningDate,
                birthDate: tempInfo?.birthDate || ""
            })
            setSkills(tempInfo?.skills);
            setGoals(tempInfo?.goals);
            setEducations(tempInfo?.educations);
            setExperiences(tempInfo?.experinces);

            setLoading(false);
        } else {
            setLoading(false);
            toast.warning(data, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };

    const updateUser = async (card) => {
        console.log("Card Name", card);

        var sentData;
        if (card === "intro") {
            sentData = intro;
        }
        if (card === "skills") {
            sentData = {
                skills,
            };
        }
        if (card === "goal") {
            sentData = { goals };
        }
        if (card === "eduInfo") {
            sentData = { educations };
        }
        if (card === "experiences") {
            sentData = { experinces };
        }

        if(card === "main"){
            sentData = {...mainInfo}
        }
        console.log("data", sentData);
// return;
        const res = await fetch(
            `${process.env.REACT_APP_URL}/users/updateUser/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sentData),
            }
        );
        const data = await res.json();
        console.log("user Data", data);
        if (res.status === 200) {
            setUserData(data);
            setMainInfo({
                firstName: data?.firstName,
                lastName: data?.lastName,
                email: data?.email,
                designation: data?.designation,
                empId: data?.empId,
                birthDate: data?.birthDate || "",
                joiningDate: data?.joiningDate
            })
            setSkills(data?.skills);
            setGoals(data?.goals);
            setEducations(data?.educations);
            setExperiences(data?.experinces);

            toast.success("Profile updated successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            });
        } else {
            toast.warning("Something went wrong", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };

    const getAllDesignations = async () => {
        const res = await fetch(`${process.env.REACT_APP_URL}/designations/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer " + jwt
            },
        })
        const data = await res.json()
        console.log("Designations", data);
        if (res.status === 200) {
            setDesignation(data.roles)
        } else {
            toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }

    }
    useEffect(() => {
        getSingleUser();
    }, []);

    useEffect(() => {
        getAllDesignations()
    }, [])

    return loading ? (
        <Loading />
    ) : (
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
                                                <a href="#">
                                                    <img alt="" src={userData?.imagePath} />
                                                </a>
                                            </div>
                                        </div>
                                        <div class="profile-basic">
                                            <div class="row">
                                                <div class="col-md-5">
                                                    <div class="profile-info-left">
                                                        <h3 class="user-name m-t-0 mb-0">
                                                            {!cardEdit.main ? (
                                                                `${mainInfo?.firstName} ${mainInfo?.lastName}`

                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        name="firstName"
                                                                        placeholder="firstame"
                                                                        value={mainInfo.firstName}
                                                                        onChange={(e) => {
                                                                            console.log(e.target.value);
                                                                            handleFields(e, "main");
                                                                        }}
                                                                    />

                                                                    <br />

                                                                    <input
                                                                        style={{ marginTop: "10px" }}
                                                                        type="text"
                                                                        name="lastName"
                                                                        placeholder="last name"
                                                                        value={mainInfo.lastName}
                                                                        onChange={(e) => {
                                                                            handleFields(e, "main");
                                                                        }}

                                                                    />

                                                                </>
                                                            )}

                                                            {/* {userData?.firstName} {userData?.lastName} */}
                                                        </h3>
                                                        {!cardEdit.main ? (<small>{userData?.designation?.name}</small>)
                                                            : (
                                                                <>
                                                                    <br />
                                                                    <select name="designation"
                                                                    value={mainInfo?.designation}
                                                                        onChange={(e) => {
                                                                            setMainInfo({ ...mainInfo, designation: e.target.value })

                                                                        }}
                                                                    >

                                                                        {designation.map((val, ind) => {
                                                                            return (
                                                                                <option key={val._id} value={val?._id}>{val?.name}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </>
                                                            )
                                                        }

                                                        <div class="staff-id">
                                                            Employee ID : {!cardEdit.main ? userData?.empId : <>
                                                                <input
                                                                    style={{ marginTop: "10px" }}

                                                                    type="text"
                                                                    name="empId"
                                                                    value={mainInfo?.empId}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "main");
                                                                    }}
                                                                />

                                                            </>}
                                                        </div>
                                                        <div class="small doj ">
                                                            Date of Join :{" "}
                                                            {!cardEdit.main ? moment(mainInfo?.joiningDate).utc().format("YYYY-MM-DD") : <>

                                                                <input
                                                                    style={{ marginTop: "10px" }}

                                                                    type="date"
                                                                    name="joiningDate"
                                                                    value={moment(mainInfo?.joiningDate).utc().format("YYYY-MM-DD")}
                                                                    onChange={(e) => {
                                                                        console.log(e.target.value);
                                                                        handleFields(e, "main");
                                                                    }}
                                                                />
                                                            </>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-7">
                                                    <ul class="personal-info">
                                                        {/* <li>
                                                            <div class="title">Phone:</div>
                                                            {!cardEdit.main ? <div>
                                                                {userData?.personalPhone
                                                                    ? userData?.personalPhone
                                                                    : "N/A"}
                                                            </div> : <>
                                                                <input
                                                                    type="text"
                                                                    name="personalPhone"
                                                                    value={userData?.personalPhone}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "intro");
                                                                    }}
                                                                />
                                                            </>}

                                                        </li> */}
                                                        <li>
                                                            <div class="title">Email:</div>
                                                            {!cardEdit.main ? <div>
                                                                <span class="__cf_email__">
                                                                    {userData?.email ? userData?.email : "N/A"}
                                                                </span>
                                                            </div> : <>
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    value={mainInfo?.email}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "main");
                                                                    }}
                                                                />
                                                            </>}

                                                        </li>
                                                        <li>
                                                            <div class="title">Birthday:</div>
                                                            {!cardEdit.main ? <div>
                                                                <span class="__cf_email__">
                                                                    {mainInfo?.birthDate ?moment(mainInfo?.birthDate).utc().format("YYYY-MM-DD") : "N/A"}
                                                                </span>
                                                            </div> : <>
                                                                <input
                                                                    type="date"
                                                                    name="birthDate"
                                                                    value={moment(mainInfo?.birthDate).utc().format("YYYY-MM-DD")}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "main");
                                                                    }}
                                                                />
                                                            </>}
                                                            
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="pro-edit">
                                            {/* <a data-bs-target="#profile_info" data-bs-toggle="modal"
                                            class="edit-icon" href="#"></a> */}
                                            {
                                                userInfoData?.role.alias === "Admin" ? (
                                                !cardEdit.main ? (
                                                    <Tooltip title="Edit">
                                                        <EditIcon
                                                            className="edit-icon"
                                                            onClick={() => {
                                                                setCardEdit({ ...cardEdit, main: true });
                                                            }}
                                                        />
                                                    </Tooltip>
                                                ) : (
                                                    <>
                                                        <Tooltip title="Save" sx={{ marginLeft: "10px" }}>
                                                            <SendIcon
                                                            sx={{
                                                                display: (mainInfo.birthDate && 
                                                                    mainInfo.designation &&
                                                                    mainInfo.email &&
                                                                    mainInfo.empId &&
                                                                    mainInfo.firstName &&
                                                                    mainInfo.lastName &&
                                                                    mainInfo.joiningDate 
                                                                    )? "block": "none"
                                                            }}

                                                                className="edit-icon"
                                                                onClick={() => {
                                                                    updateUser("main");
                                                                    console.log("main info", mainInfo);
                                                                    setCardEdit({ ...cardEdit, main: false });
                                                                }}
                                                            />
                                                        </Tooltip>
                                                        <Tooltip title="Cancel">
                                                            <CancelIcon
                                                                className="edit-icon"
                                                                onClick={() =>
                                                                    setCardEdit({ ...cardEdit, main: false })
                                                                }
                                                            />
                                                        </Tooltip>
                                                    </>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content">
                        <div
                            id="emp_profile"
                            class="pro-overview tab-pane fade show active"
                        >
                            {/* Personal Information  and Emergency Contact*/}
                            <div class="row">
                                <div class="col-md-12 d-flex">
                                    <div class="card profile-box flex-fill">
                                        <div class="card-body">
                                            <h3 class="card-title">
                                                Personal Informations
                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    !cardEdit.intro ? (
                                                        <Tooltip title="Edit">
                                                            <EditIcon
                                                                className="edit-icon"
                                                                onClick={() => {
                                                                    setCardEdit({ ...cardEdit, intro: true });
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <>
                                                            <Tooltip title="Save" sx={{ marginLeft: "10px" }}>
                                                                <SendIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        updateUser("intro");
                                                                        setCardEdit({ ...cardEdit, intro: false });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Cancel">
                                                                <CancelIcon
                                                                    className="edit-icon"
                                                                    onClick={() =>
                                                                        setCardEdit({ ...cardEdit, intro: false })
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </>
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <ul class="personal-info">
                                                <li>
                                                    <div class="title">Phone</div>
                                                    {!cardEdit.intro ? (
                                                        <div>{userData?.personalPhone}</div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="personalPhone"
                                                            value={intro.personalPhone}
                                                            onChange={(e) => {
                                                                handleFields(e, "intro");
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                                <li>
                                                    <div class="title">Nationality</div>
                                                    {!cardEdit.intro ? (
                                                        <div>{userData?.nationality}</div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="nationality"
                                                            value={intro.nationality}
                                                            onChange={(e) => {
                                                                handleFields(e, "intro");
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                                <li>
                                                    <div class="title">Religion</div>
                                                    {!cardEdit.intro ? (
                                                        <div>{userData?.religion}</div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="religion"
                                                            value={intro.religion}
                                                            onChange={(e) => {
                                                                handleFields(e, "intro");
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                                <li>
                                                    <div class="title">Marital status</div>
                                                    {!cardEdit.intro ? (
                                                        <div>{userData?.maritalStatus}</div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="maritalStatus"
                                                            value={intro.maritalStatus}
                                                            onChange={(e) => {
                                                                handleFields(e, "intro");
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                                <li>
                                                    <div class="title">Blood Group</div>
                                                    {!cardEdit.intro ? (
                                                        <div>{userData?.bloodGroup}</div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="bloodGroup"
                                                            value={intro.bloodGroup}
                                                            onChange={(e) => {
                                                                handleFields(e, "intro");
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* skills And Goal Setting */}
                            <div class="row">
                                <div class="col-md-6 d-flex">
                                    <div class="card profile-box flex-fill">
                                        <div class="card-body">
                                            <h3 class="card-title">
                                                skills
                                                {/* <Tooltip title='Save'>
                                                        <SendIcon className='edit-icon' onClick={() => {
                                                            updateUser('skills')
                                                        }} />
                                                    </Tooltip> */}
                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    <>
                                                        {cardEdit.skills ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon
                                                                        className="edit-icon"
                                                                        onClick={() => {
                                                                            updateUser("skills");
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title="cancel">
                                                                    <CancelIcon
                                                                        className="edit-icon"
                                                                        onClick={() =>
                                                                            setCardEdit({
                                                                                ...cardEdit,
                                                                                skills: false,
                                                                            })
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {!cardEdit.skills && (
                                                            <Tooltip title="Edit" sx={{ marginLeft: "10px" }}>
                                                                <EditIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        setCardEdit({ ...cardEdit, skills: true });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <div class="experience-box">
                                                <ul class="experience-list">
                                                    {skills?.map((val, ind) => {
                                                        return (
                                                            <>
                                                                <li key={ind}>
                                                                    <div class="experience-user">
                                                                        <div class="before-circle"></div>
                                                                    </div>
                                                                    <div class="experience-content">
                                                                        {cardEdit.skills && (
                                                                            <Tooltip title='delete'>
                                                                                <DeleteIcon
                                                                                    id={ind}
                                                                                    className="edit-icon"
                                                                                    onClick={() =>
                                                                                        setSkills(
                                                                                            skills.filter(
                                                                                                (val, indx) => indx !== ind
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </Tooltip>
                                                                        )}

                                                                        <div class="timeline-content">
                                                                            <a href="#/" class="name">
                                                                                {val?.title}
                                                                            </a>
                                                                            <div>{val?.tools}</div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        );
                                                    })}
                                                </ul>

                                                {cardEdit.skills && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            placeholder="Add skills Field Name"
                                                            name="title"
                                                            value={skillFiled.title}
                                                            onChange={(e) => {
                                                                handleFields(e, "expert");
                                                            }}
                                                        />
                                                        <br />
                                                        <input
                                                            type="text"
                                                            placeholder="Add Stack Name"
                                                            name="tools"
                                                            style={{
                                                                marginTop: "10px",
                                                                marginBottom: "10px",
                                                            }}
                                                            value={skillFiled.tools}
                                                            onChange={(e) => {
                                                                handleFields(e, "expert");
                                                            }}
                                                        />
                                                        <br />
                                                        <Button
                                                            disabled={(skillFiled.title && skillFiled.tools) ? false : true}
                                                            variant="contained"
                                                            onClick={() => {
                                                                addskills();
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 d-flex">
                                    <div class="card profile-box flex-fill">
                                        <div class="card-body">
                                            <h3 class="card-title">
                                                Goal Setting
                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    <>
                                                        {cardEdit.goalSetting ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon
                                                                        className="edit-icon"
                                                                        onClick={() => updateUser("goal")}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title="Cancel">
                                                                    <CancelIcon
                                                                        className="edit-icon"
                                                                        onClick={() =>
                                                                            setCardEdit({
                                                                                ...cardEdit,
                                                                                goalSetting: false,
                                                                            })
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {!cardEdit.goalSetting && (
                                                            <Tooltip title="Edit" sx={{ marginLeft: "10px" }}>
                                                                <EditIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        setCardEdit({
                                                                            ...cardEdit,
                                                                            goalSetting: true,
                                                                        });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <div class="experience-box">
                                                <ul class="experience-list">
                                                    {goals.map((val, ind) => {
                                                        return (
                                                            <>
                                                                <li key={ind}>
                                                                    <div class="experience-user">
                                                                        <div class="before-circle"></div>
                                                                    </div>
                                                                    <div class="experience-content">
                                                                        {cardEdit.goalSetting && (
                                                                            <Tooltip title='delete'>
                                                                                <DeleteIcon
                                                                                    className="edit-icon"
                                                                                    onClick={() =>
                                                                                        setGoals(
                                                                                            goals.filter(
                                                                                                (val, indx) => indx !== ind
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </Tooltip>
                                                                        )}
                                                                        <div class="timeline-content">
                                                                            <a href="#/" class="name">
                                                                                {val.goalType}
                                                                            </a>
                                                                            <div>{val.goalName}</div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        );
                                                    })}
                                                </ul>

                                                {cardEdit.goalSetting && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            placeholder="Goal Type"
                                                            name="goalType"
                                                            value={goalSettingField.goalType}
                                                            onChange={(e) => {
                                                                handleFields(e, "goal");
                                                            }}
                                                        />
                                                        <br />
                                                        <input
                                                            type="text"
                                                            placeholder="Goal Names"
                                                            name="goalName"
                                                            style={{
                                                                marginTop: "10px",
                                                                marginBottom: "10px",
                                                            }}
                                                            value={goalSettingField.goalName}
                                                            onChange={(e) => {
                                                                handleFields(e, "goal");
                                                            }}
                                                        />
                                                        <br />
                                                        <Button
                                                            disabled={(goalSettingField.goalName && goalSettingField.goalType) ? false : true}
                                                            variant="contained"
                                                            onClick={() => {
                                                                addGoals();
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </>
                                                )}
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
                                            <h3 class="card-title">
                                                Education Informations{" "}
                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    <>
                                                        {cardEdit.eduInfo ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon className="edit-icon"
                                                                        onClick={() => updateUser("eduInfo")}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title='cancel'>
                                                                    <CancelIcon
                                                                        className="edit-icon"
                                                                        onClick={() =>
                                                                            setCardEdit({
                                                                                ...cardEdit,
                                                                                eduInfo: false,
                                                                            })
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {!cardEdit.eduInfo && (
                                                            <Tooltip title="Edit" sx={{ marginLeft: "10px" }}>
                                                                <EditIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        setCardEdit({ ...cardEdit, eduInfo: true });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <div class="experience-box">
                                                <ul class="experience-list">
                                                    {educations.map((val, ind) => {
                                                        return (
                                                            <>
                                                                <li key={ind}>
                                                                    <div class="experience-user">
                                                                        <div class="before-circle"></div>
                                                                    </div>
                                                                    <div class="experience-content">
                                                                        {cardEdit.eduInfo && (
                                                                            <Tooltip title='delete'>
                                                                                <DeleteIcon className="edit-icon" />
                                                                            </Tooltip>
                                                                        )}
                                                                        <div class="timeline-content">
                                                                            <a href="#/" class="name">
                                                                                {val.institution}
                                                                            </a>
                                                                            <div>{val.degree}</div>
                                                                            <span class="time">
                                                                                {val.startYear}-{val.endYear}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        );
                                                    })}
                                                </ul>

                                                {cardEdit.eduInfo && (
                                                    <>
                                                        {/* <input type="text" placeholder='Institution' name="institution" value={educationField.institution} onChange={(e) => {
                                                            handleFields(e, 'eduInfo')
                                                        }} /> */}

                                                        <TextField

                                                            id="outlined-search"
                                                            label="Institution"
                                                            name="institution"
                                                            value={educationField.institution}
                                                            type="text"
                                                            sx={{
                                                                // minWidth: "50%",
                                                                // maxHeight: 345,
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "eduInfo");
                                                            }}
                                                        />
                                                        <br />
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]}>
                                                                <DatePicker
                                                                    sx={{
                                                                        width: .9,
                                                                        maxHeight: 345,
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            error: false,
                                                                        },
                                                                    }}

                                                                    label="Start Year"
                                                                    value={dayjs(educationField.startYear)}
                                                                    onChange={(e) =>
                                                                        setEducationField({
                                                                            ...educationField,
                                                                            startYear: new Date(
                                                                                e["$d"]
                                                                            ).toLocaleDateString(),
                                                                        })
                                                                    }
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        {/* <br /> */}
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]}>
                                                                <DatePicker
                                                                    sx={{
                                                                        width: .9,
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            error: false,
                                                                        },
                                                                    }}
                                                                    // slotProps={{ textField: { size: 'small' } }}
                                                                    label="End Year"
                                                                    value={dayjs(educationField.endYear)}
                                                                    onChange={(e) =>
                                                                        setEducationField({
                                                                            ...educationField,
                                                                            endYear: new Date(
                                                                                e["$d"]
                                                                            ).toLocaleDateString(),
                                                                        })
                                                                    }
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        {/* <br /> */}
                                                        <TextField
                                                            id="outlined-search"
                                                            label="Degree"
                                                            name="degree"
                                                            value={educationField.degree}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "eduInfo");
                                                            }}
                                                        />
                                                        <br />
                                                        <TextField
                                                            id="outlined-search"
                                                            label="Location"
                                                            name="location"
                                                            value={educationField.location}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                maxHeight: 345,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "eduInfo");
                                                            }}
                                                        />
                                                        <br />
                                                        <br />

                                                        <Button
                                                            disabled={(educationField.institution &&
                                                                educationField.degree &&
                                                                educationField.startYear &&
                                                                educationField.endYear &&
                                                                educationField.location) ? false : true}
                                                            sx={{
                                                                // width: .5
                                                            }}
                                                            variant="contained"
                                                            onClick={() => {
                                                                addEducations();
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 d-flex">
                                    <div class="card profile-box flex-fill">
                                        <div class="card-body">
                                            <h3 class="card-title">
                                                Experience{" "}
                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    <>
                                                        {cardEdit.experience ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon className="edit-icon"
                                                                        onClick={() => updateUser("experiences")}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title='cancel'>
                                                                    <CancelIcon
                                                                        className="edit-icon"
                                                                        onClick={() =>
                                                                            setCardEdit({
                                                                                ...cardEdit,
                                                                                experience: false,
                                                                            })
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {!cardEdit.experience && (
                                                            <Tooltip
                                                                title="Edit"
                                                                sx={{ marginLeft: "-10px" }}
                                                            >
                                                                <EditIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        setCardEdit({
                                                                            ...cardEdit,
                                                                            experience: true,
                                                                        });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <div class="experience-box">
                                                <ul class="experience-list">
                                                    {experinces?.map((val, ind) => {
                                                        return (
                                                            <>
                                                                <li key={ind}>
                                                                    <div class="experience-user">
                                                                        <div class="before-circle"></div>
                                                                    </div>
                                                                    <div class="experience-content">
                                                                        {cardEdit.experience && (
                                                                            <Tooltip title="delete">
                                                                                <DeleteIcon className="edit-icon" />
                                                                            </Tooltip>
                                                                        )}
                                                                        <div class="timeline-content">
                                                                            <a href="#/" class="name">
                                                                                {val?.title} at {val?.company}.
                                                                            </a>
                                                                            <span class="time">
                                                                                {val?.startYear} -{" "}
                                                                                {val.endYear ? val.endYear : "Ongoing"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        );
                                                    })}
                                                </ul>

                                                {cardEdit.experience && (
                                                    <>
                                                        {/* <input type="text" placeholder='Institution' name="institution" value={educationField.institution} onChange={(e) => {
                                                            handleFields(e, 'eduInfo')
                                                        }} /> */}

                                                        <TextField
                                                            id="outlined-search"
                                                            label="Company"
                                                            name="company"
                                                            value={experienceField.company}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                console.log(e.target.value);
                                                                handleFields(e, "experiences");
                                                            }}
                                                        />
                                                        <br />
                                                        <TextField
                                                            id="outlined-search"
                                                            label="Designation"
                                                            name="title"
                                                            value={experienceField.title}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "experiences");
                                                            }}
                                                        />
                                                        <br />
                                                        <TextField
                                                            id="outlined-search"
                                                            label="Location"
                                                            name="location"
                                                            value={experienceField.location}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "experiences");
                                                            }}
                                                        />
                                                        <br />
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]}>
                                                                <DatePicker
                                                                    sx={{
                                                                        width: .9,
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            error: false,
                                                                        },
                                                                    }}
                                                                    label="Start Date"
                                                                    value={dayjs(experienceField.startYear)}
                                                                    onChange={(e) =>
                                                                        setExperienceField({
                                                                            ...experienceField,
                                                                            startYear: new Date(
                                                                                e["$d"]
                                                                            ).toLocaleDateString(),
                                                                        })
                                                                    }
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        <br />
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]}>
                                                                <DatePicker
                                                                    sx={{
                                                                        width: .9,
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            error: false,
                                                                        },
                                                                    }}
                                                                    label="End Date"
                                                                    value={dayjs(experienceField.endYear)}
                                                                    onChange={(e) =>
                                                                        setExperienceField({
                                                                            ...experienceField,
                                                                            endYear: new Date(
                                                                                e["$d"]
                                                                            ).toLocaleDateString(),
                                                                        })
                                                                    }
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        <br />


                                                        <Button
                                                            variant="contained"
                                                            disabled={(experienceField.company && experienceField.endYear && experienceField.startYear && experienceField.location && experienceField.title) ? false : true}
                                                            onClick={() => {
                                                                addExperineces();
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </>
                                                )}
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
                                            <h3 class="card-title">
                                                Leave Setting
                                                {userInfoData?.role.alias === "Admin" ? (
                                                    <>
                                                        {cardEdit.leaveSetting ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon className="edit-icon" />
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <CancelIcon
                                                                        className="edit-icon"
                                                                        onClick={() =>
                                                                            setCardEdit({
                                                                                ...cardEdit,
                                                                                leaveSetting: false,
                                                                            })
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {!cardEdit.leaveSetting && (
                                                            <Tooltip
                                                                title="Edit"
                                                                sx={{ marginLeft: "-10px" }}
                                                            >
                                                                <EditIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        setCardEdit({
                                                                            ...cardEdit,
                                                                            leaveSetting: true,
                                                                        });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <ul class="personal-info">
                                                <li style={{ display: "flex", alignItems: "center" }}>
                                                    <div class="title">Annual Casual Leave</div>
                                                    <TextField
                                                        id="outlined-search"
                                                        label="11"
                                                        type="search"
                                                        disabled={cardEdit.leaveSetting ? false : true}
                                                    />
                                                </li>
                                                <li style={{ display: "flex", alignItems: "center" }}>
                                                    <div class="title">Annual Sick Leave</div>
                                                    <TextField
                                                        id="outlined-search"
                                                        label="7"
                                                        type="search"
                                                        disabled={cardEdit.leaveSetting ? false : true}
                                                    />
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
    );
};

export default Profile;
