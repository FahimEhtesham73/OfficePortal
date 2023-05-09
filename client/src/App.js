// Importing React Components
import React from "react";
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
import Profile from "./Component/Profile/Profile";
import Signin from "./Component/Signin";
import AllEmployees from "./Component/AllEmployees";
import Punch from "./Component/Attendance/Punch";
import Attendancesheet from "./Component/Attendance/Attendancesheet";
import Holidays from "./Component/Leave/Holidays";
import LeaveEmployee from "./Component/Leave/LeaveEmployee";
import LeaveStatusLead from "./Component/Leave/LeaveStatusLead";
import Teamlead from "./Component/TeamLead/Teamlead";
import AdminCombinedProtected from "./Component/Protected Router/AdminCombinedProtected";
import AuthenticateUser from "./Component/Protected Router/AuthenticateUser";
import Project from "./Component/Project/Project";

const App = () => {
  return (
    <div className="App">
      <Topnavbar />
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

        {/* All Employees */}
      </Routes>
      <ToastContainer />
    </div>
  );
}


// What is Redux?

export default App;
