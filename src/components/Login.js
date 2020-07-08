import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Button, Form, Row, Col, Modal } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import firebase from './auth/firebase'
import NavBar from './layout/NavBar'

function Login() {
    const [type, setType] = useState("")
    const history = useHistory()
    const [modal, setModal] = useState(false)
    const [password, setPassword] = useState()

    const isLogin = () => {
        if (type == "employee") {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then(res => {
                    console.log(res.user.displayName)
                    console.log(firebase.auth().currentUser.uid)
                    history.push("/TimeCard");
                })
                .catch(err => {
                    console.log("failed to login")
                })
        }

        else if (type == "employer") {
            setModal(true)


        }

        // setLogin(true);  
    }

    const submitEmployer = () => {
        console.log(password)
        if (password == '5566') {
            // var provider = new firebase.auth.GoogleAuthProvider();
            // firebase.auth().signInWithPopup(provider)
            //     .then(res => {
            //         console.log(res.user.displayName)
            //         console.log(firebase.auth().currentUser.uid)
            //         history.push('/PayFormula')
            //     })
            //     .catch(err => {
            //         console.log("failed to login")
            //     })
            history.push('/PayFormula')
        }
        else{
            setModal(false)
            alert("Employer password was wrong")
        }

    }

    const handleChange = e => {
        if(e.target.name == 'type')
            setType(e.target.value)
        if(e.target.name == 'password')
            setPassword(e.target.value)
    }
    // function signin() {

    // }

    return (
        <div className='home_bg' >
            <Modal onHide={() => { setModal(false) }} show={modal} className="App">
                <Modal.Header closeButton > <h4>Employer Login </h4></Modal.Header>
                <Form>
                    {/* <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            Email
    </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue="email@example.com" />
                        </Col>
                    </Form.Group> */}

                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                            Password
    </Form.Label>
                        <Col sm="10">
                            <Form.Control onChange={handleChange} name="password" type="password" placeholder="Password" />
                        </Col>
                    </Form.Group>
                    <Button className="mb2" onClick={submitEmployer}>Login</Button>
                </Form>
            </Modal>
            <div className="App">
            <Form.Check inline value="employee" name="type" label="Employee" type="radio" checked={type == "employee"} onChange={handleChange} />
            <Form.Check inline value="employer" name="type" label="Employer" type="radio" checked={type == "employer"} onChange={handleChange} />
            <Button onClick={isLogin}>Log in</Button>
            </div>

        </div>
    )
}

export default Login;