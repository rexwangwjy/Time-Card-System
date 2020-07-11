import React from 'react'
import { Link } from 'react-router-dom'
import {Navbar, Nav, NavDropdown,Form, Button, FormControl} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect, useHistory} from 'react-router-dom';
import firebase from '../auth/firebase'


function NavBar(){
    const history = useHistory()
    function signin(){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
        .then(res => {
            console.log(res.user.displayName)
            console.log(firebase.auth().currentUser.uid)
        })
    }

    function signout(){
        firebase.auth().signOut()
        history.push('/login')
    }

    return (
        <div>
        
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand >Time Card</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
            {/* <Button variant="outline-success" onClick = {signin}>Sign In</Button> */}
            <Button variant="danger" onClick = {signout}>Sign Out</Button>
            {/* <SignedInLink />
            <SignedOutLink /> */}
                
                
            </Navbar.Collapse>
        </Navbar>

        </div>
    )
}

export default NavBar;