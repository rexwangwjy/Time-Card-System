import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Button, Form, Col } from 'react-bootstrap'
import firebase from './auth/firebase'
import NavBar from './layout/NavBar'
import employeeReducer from '../store/reducers/employeeReducer'

function TimeCard() {

    const [list, setList] = useState([])
    const [hasTimedIn, setHasTimedIn] = useState(false)
    const [hasTimedOut, setHasTimedOut] = useState(true)

    const [timedIn, setTimedIn] = useState("")
    const [timedOut, setTimedOut] = useState("")

    const [dt, setDt] = useState(new Date().toLocaleString());

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            firebase.database().ref('users/' + user.uid + '/' + "last_date").on('value', (snap) => {
                var lastDate = snap.val()
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0');
                var yyyy = today.getFullYear();
                const date = yyyy + '-' + mm + '-' + dd;
                var updates = {};
                updates['/users/' + user.uid + '/email'] = user.email
                updates['/users/' + user.uid + '/name'] = user.displayName
                firebase.database().ref().update(updates)

                if (date == lastDate) {
                    setHasTimedIn(true);
                }

                firebase.database().ref('users/' + user.uid + '/' + date + "/time_out").on('value', (snap) => {
                    if (snap.val() == null && date == lastDate)
                        setHasTimedOut(false);
                })

                firebase.database().ref('users/' + user.uid + '/' + date + "/time_out").on('value', (snap) => {
                    if (snap.val() != null) {
                        setHasTimedOut(true)
                        var h = String(snap.val().split(":")[0]).padStart(2, '0')
                        var min = String(snap.val().split(":")[1]).padStart(2, '0')
                        setTimedOut(h + ":" + min);
                    }

                })

                firebase.database().ref('users/' + user.uid + '/' + date + "/time_in").on('value', (snap) => {
                    if (snap.val() != null) {
                        setHasTimedIn(true);
                        var h = String(snap.val().split(":")[0]).padStart(2, '0')
                        var min = String(snap.val().split(":")[1]).padStart(2, '0')
                        setTimedIn(h + ":" + min);
                    }

                })

            })
        }

        else {

        }

    })


    useEffect(() => {
        let secTimer = setInterval(() => {
            var today = new Date();
            var date = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            var time = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
            var dateTime = date + ' ' + time;
            setDt(dateTime)

        }, 1000)

        return () => clearInterval(secTimer);
    }, []);


    function timeIn() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                if (hasTimedIn == false) {
                    setHasTimedIn(true)
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0');
                    var yyyy = today.getFullYear();
                    const date = yyyy + '-' + mm + '-' + dd;
                    updates['/users/' + user.uid + '/last_date'] = date
                    updates['/users/' + user.uid + '/' + date + '/time_in'] = today.getHours() + ":" + today.getMinutes();
                    firebase.database().ref().update(updates)
                }
            }
            else {
                console.log("no user is signed in")
            }
        })
    }

    function timeOut() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                if (hasTimedOut == false) {
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    setHasTimedOut(true)
                    var updates = {};
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0');
                    var yyyy = today.getFullYear();
                    const date = yyyy + '-' + mm + '-' + dd;
                    var time_out = today.getHours() + ":" + today.getMinutes();
                    updates['/users/' + user.uid + '/' + date + '/time_out'] = time_out
                    var time_in = ""
                    firebase.database().ref('/users/' + user.uid + '/' + date + '/time_in').on('value', snap => {
                        time_in = snap.val();
                    })

                    var min = 0;
                    var hour = 0;

                    if ((time_out.split(':')[1] - time_in.split(':')[1]) < 0) {
                        min = 60 + (time_out.split(':')[1] - time_in.split(':')[1])
                        hour = (time_out.split(':')[0] - time_in.split(':')[0]) - 1
                    }
                    else {
                        min = time_out.split(':')[1] - time_in.split(':')[1]
                        hour = (time_out.split(':')[0] - time_in.split(':')[0])
                    }

                    updates['/users/' + user.uid + '/' + date + '/hours'] = hour
                    updates['/users/' + user.uid + '/' + date + '/minutes'] = min

                    firebase.database().ref().update(updates)
                }
            }
            else {
                console.log("no user is signed in")
            }
        })
    }

    function display() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref('users/' + user.uid).once('value', (snap) => {

                    var l = []
                    snap.forEach(child => {
                        if (child.key != 'last_date' && child.key != 'email' && child.key != 'name' && child.key != 'formula' && child.key != 'wage') {
                            var time_in = null
                            var time_out = null
                            if (child.val().time_in != null) {
                                var h = String(child.val().time_in.split(":")[0]).padStart(2, '0')
                                var min = String(child.val().time_in.split(":")[1]).padStart(2, '0')
                                time_in = (h + ":" + min)
                            }

                            if (child.val().time_out != null) {
                                h = String(child.val().time_out.split(":")[0]).padStart(2, '0')
                                min = String(child.val().time_out.split(":")[1]).padStart(2, '0')
                                time_out = (h + ":" + min)
                            }
                            l.push({
                                date: child.key,
                                time_in: time_in,
                                time_out: time_out
                            })
                        }

                    })
                    setList(l.reverse())
                })
            }

        })
    }

    return (
        <div >
            <NavBar />
            <div className="App">
                <h1 className="block"> Time: {dt} </h1>
            </div>
            <Form className="table_field">

                <Form className="align">
                    <Form.Group controlId="timeIn">
                        <Button variant="secondary" disabled={hasTimedIn} onClick={timeIn}> Time In </Button>
                        <Form.Label><h4>: {timedIn}</h4></Form.Label>
                    </Form.Group>

                    <Form.Group controlId="timeOut">
                        <Button variant="secondary" disabled={hasTimedOut} onClick={timeOut}> Time Out </Button>
                        <Form.Label><h4>: {timedOut}</h4></Form.Label>
                    </Form.Group>
                </Form>
            </Form>
            {/* <Button variant="secondary" disabled={hasTimedIn} onClick={timeIn}> Time In </Button>
            <Button variant="secondary" disabled={hasTimedOut} onClick={timeOut}> Time Out </Button> */}

            <div className="App">
                <div className="table_field">
                    <Button variant="outline-success" onClick={display}> Show history </Button>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time in</th>
                                <th>Time out</th>
                            </tr>
                        </thead>
                        <tbody>

                            {list.map(item => (
                                <tr>
                                    <td>{item.date}</td>
                                    <td>{item.time_in}</td>
                                    <td>{item.time_out}</td>
                                </tr>

                            ))}

                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}

export default TimeCard;