// Importing React Components
import React from "react";
import { Routes, Route } from "react-router-dom"

// Importing bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'

// importing Project Components
import Topnavbar from "./Component/shared/Topnavbar";
import Profile from "./Component/Profile/Profile";

const App = () => {
  return (
    <div className="App">
      <Topnavbar />
      {/* <Routes>
        <Route path="/profile" exact element={<Profile/>}/>
      </Routes> */}
    </div>
  );
}

export default App;
