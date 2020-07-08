import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css';
import {Button} from 'react-bootstrap'
import NavBar from './components/layout/NavBar'
import TimeCard from './components/TimeCard'
import Login from './components/Login'
import { useHistory } from "react-router-dom";

function App() {
  const history = useHistory()
  
  // function login(){
    history.push("/login")
  // }
  return (
    
      <div className="App">
        {/* {
          login == false ?
            <Login /> :
            <Login />
        } */}
        {/* <Link to="/login">login</Link> */}
        {/* <Button onClick={login} >login </Button> */}
      </div>
      
  );
}

export default App;
