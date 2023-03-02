// Importing React Components
import React from "react";
import { Routes, Route } from "react-router-dom"

// Importing bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'

// importing Project Components
import Topnavbar from "./Component/shared/Topnavbar";

const App = () => {
  return (
    <div className="App">
      <Topnavbar />
    </div>
  );
}

export default App;
