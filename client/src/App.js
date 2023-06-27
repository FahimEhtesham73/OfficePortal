// Importing React Components
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom"

// Importing bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'

// Importing Packages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// importing Project Components
import Topnavbar from "./Component/shared/Topnavbar";
import Signin from "./Component/Signin";
import AdminCombinedProtected from "./Component/Protected Router/AdminCombinedProtected";
import AuthenticateUser from "./Component/Protected Router/AuthenticateUser";
import Loading from "./Component/Hook/Loading/Loading";

const Punch = lazy(()=> import("./Component/Attendance/Punch"));
const Profile = lazy(()=> import("./Component/Profile/Profile"));
const AllEmployees = lazy(()=> import("./Component/AllEmployees"));
const Attendancesheet = lazy(()=> import("./Component/Attendance/Attendancesheet"));
const Holidays = lazy(()=> import("./Component/Leave/Holidays"));
const LeaveEmployee = lazy(()=> import("./Component/Leave/LeaveEmployee"));
const LeaveStatusLead = lazy(()=> import("./Component/Leave/LeaveStatusLead"));
const Teamlead = lazy(()=> import("./Component/TeamLead/Teamlead"));
const Project = lazy(()=> import("./Component/Project/Project"));
const ProjectDetail = lazy(()=> import("./Component/Project/ProjectDetail"));


const App = () => {
  return (
    <div className="App">
      <Topnavbar />
      <Suspense fallback ={ <Loading />}>
      <Routes>
        <Route path="/signin" exact element={<Signin/>}/>
        <Route path='/profile/:id'  element={<AuthenticateUser><Profile/></AuthenticateUser>}/>
        <Route path='/allemployee' element={<AuthenticateUser><AllEmployees/></AuthenticateUser>}/>
        <Route path='/' element={<AuthenticateUser><Punch/></AuthenticateUser>}/>
        <Route path='/attendance' element={<Attendancesheet/>}/>
        <Route path='/holiday' element={<Holidays/>}/>
        <Route path='/leaveemployee' element={<LeaveEmployee/>}/>
        <Route path='/leaveadmin' element={<AdminCombinedProtected><LeaveStatusLead/></AdminCombinedProtected> }/>
        <Route path='/teamlead' element={<Teamlead/>}/>
        <Route path='/projects' element={<AuthenticateUser><Project /></AuthenticateUser>}/>
        <Route path='/projects/:id' element={ <AuthenticateUser> <ProjectDetail /> </AuthenticateUser> }/>
        {/* All Employees */}
      </Routes>

      </Suspense>
      <ToastContainer />
    </div>
  );
}


// What is Redux?

export default App;
