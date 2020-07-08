import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Button, Form, Col, Row, InputGroup, Modal } from 'react-bootstrap'
import * as math from 'mathjs'
import firebase from './auth/firebase'
import NavBar from './layout/NavBar'

function PayFormula() {

    const [date, setDate] = useState("")
    const [params, setParams] = useState({})
    const [cond, setCond] = useState(false)
    const [list, setList] = useState([])
    const [formulaAll, setFormulaAll] = useState("")
    const [formula, setFormula] = useState("")
    const [changeFormula, setChangeFormula] = useState(false)
    const [changeFormulaAll, setChangeFormulaAll] = useState(false)
    const [payAll, setPayAll] = useState("")

    const [uid, setUid] = useState("")
    const [name, setName] = useState("")
    const [wageAll, setWageAll] = useState("")
    const [wage, setWage] = useState("")

    const [currFormula, setCurrFormula] = useState()
    const [currWage, setCurrWage] = useState()

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            firebase.database().ref('/users/' + user.uid + '/formula').on('value', (snap) => {

            })
        }

        else {

        }

    })

    const closeChangeFormula = () => {
        setChangeFormula(false)
    }

    const handleChangeFormula = e => {
        const id = e.target.id
        const n = e.target.name
        setUid(e.target.id)
        setName(e.target.name)



        firebase.database().ref('users/' + id + '/formula').once('value').then(snap => {
            setCurrFormula(snap.val())
        })

        firebase.database().ref('users/' + id + '/wage').once('value').then(snap => {
            console.log(snap.val())
            setCurrWage(snap.val())
        })


        setChangeFormula(true)
    }

    const handleChangeFormulaAll = () => {
        setChangeFormulaAll(!changeFormulaAll)
    }

    const handleFormula = () => {
        var updates = {}
        if(formula != "")
            updates['users/' + uid + '/formula'] = formula
        if(wage != "")
            updates['users/' + uid + '/wage'] = wage
        firebase.database().ref().update(updates)


        setChangeFormula(false)
    }

    const handleFormulaAll = () => {

        firebase.database().ref('/users').once('value', snap => {
            var updates = {}
            snap.forEach(child => {
                updates['/users/' + child.key + '/' + 'formula'] = formulaAll;
                updates['/users/' + child.key + '/' + 'wage'] = wageAll;
            })
            firebase.database().ref().update(updates)

        })


        setChangeFormulaAll(false)
    }

    const handleChange = e => {
        if (e.target.name == 'date')
            setDate(e.target.value)

        if (e.target.name == 'formulaAll')
            setFormulaAll(e.target.value)

        if (e.target.name == 'cond')
            setCond(!cond)

        if (e.target.name == 'formula')
            setFormula(e.target.value)

        if (e.target.name == 'wage')
            setWage(e.target.value)

        if (e.target.name == 'wageAll')
            setWageAll(e.target.value)
    }


    function display() {
        if (date == "")
            return


        const l = []
        firebase.database().ref('/users').once('value').then((snap) => {
            const lPromises = []
            snap.forEach(child => {

                const request = firebase.database().ref('users/' + child.key + '/' + date).once('value').then(u => {
                    if (u.val() != null) {
                        var pay = null
                        var duration = null
                        if (child.val().wage != null && child.val().formula != null && u.val().hours != null && u.val().minutes != null) {
                            const parser = math.parser()

                            parser.set('hour', u.val().hours)
                            parser.set('min', u.val().minutes)
                            parser.set('wage', child.val().wage)
                            pay = parser.evaluate(String(child.val().formula))
                            duration = u.val().hours + "h" + u.val().minutes + "min"
                        }

                        l.push({
                            name: child.val().name,
                            email: child.val().email,
                            time_in: u.val().time_in,
                            time_out: u.val().time_out,
                            duration: duration,
                            pay: pay,
                            uid: child.key
                        })
                    }
                })
                lPromises.push(request)
            })
            return Promise.all(lPromises)
        }).then(() => {
            setList(l)
        })

    }

    return (
        <div className="container">
            <NavBar />
            <Form>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="date" name="date" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
            </Form>

            <Row>
                <Col md={{ span: 4 }}><Button variant="secondary" name="cond" onClick={display}> Show history </Button></Col>
                <Col md={{ span: 4, offset: 4 }}> <Button onClick={handleChangeFormulaAll}>Change formula for all</Button>
                </Col>
            </Row>


            {/* <Modal show={changeFormulaAll} onHide={handleChangeFormulaAll} className="container">
                <Modal.Header closeButton><h3>Modify formula for all</h3>    </Modal.Header>
                <Form.Label> </Form.Label>
          
                    <Form.Control placeholder="Only wage, hour, min, +,  -,  * and  / are allowed" name="formulaAll" onChange={handleChange} />
                    <Button onClick={handleFormulaAll}>Submit</Button>
            </Modal> */}


            <Modal show={changeFormulaAll} onHide={handleChangeFormulaAll} className="container">
                <Modal.Header closeButton><h3>Modify formula for all</h3>    </Modal.Header>
                <Form>
                    <InputGroup className="mb-2 mr-sm-2">

                        <InputGroup.Prepend>
                            <InputGroup.Text>Wage: </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control name="wageAll" onChange={handleChange}></Form.Control>
                    </InputGroup>
                    <InputGroup className="mb-2 mr-sm-2">

                        <InputGroup.Prepend>
                            <InputGroup.Text>Formula: </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control placeholder="Only wage, hour, min, +,  -,  * and  / are allowed" name="formulaAll" onChange={handleChange} />

                    </InputGroup>


                </Form>


                <Button onClick={handleFormulaAll}>Submit</Button>
            </Modal>


            <Modal show={changeFormula} onHide={closeChangeFormula} className="container">
                <Modal.Header closeButton><h3>{`Modify:${name}'s formula`}</h3>    </Modal.Header>

                <Form className="align">


                    <Form.Group>
                        <Form.Label>Current formula: {currFormula}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Current wage: {currWage}</Form.Label>
                    </Form.Group>

                </Form>


                <Form>
                    <InputGroup className="mb-2 mr-sm-2">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Wage: </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control name="wage" onChange={handleChange}></Form.Control>
                    </InputGroup>
                    <InputGroup className="mb-2 mr-sm-2">

                        <InputGroup.Prepend>
                            <InputGroup.Text>Formula: </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control placeholder="Only wage, hour, min, +,  -,  * and  / are allowed" name="formula" onChange={handleChange} />

                    </InputGroup>


                </Form>


                <Button onClick={handleFormula}>Submit</Button>
            </Modal>



            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Time in</th>
                        <th>Time out</th>
                        <th>Duration</th>
                        {/* <th>wage</th> */}
                        <th>Actual pay</th>
                        <th>Formula</th>

                    </tr>
                </thead>
                <tbody>

                    {list.map((item, ind) => (
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.time_in}</td>
                            <td>{item.time_out}</td>
                            <td>{item.duration}</td>
                            {/* <td>
                                <InputGroup>
                                    <Form.Control />
                                    <InputGroup.Append>
                                        <InputGroup.Text>$/h</InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                            </td> */}
                            <td>{item.pay}</td>
                            <td><Button onClick={handleChangeFormula} id={item.uid} name={item.name}>view formula</Button></td>
                        </tr>

                    ))}

                </tbody>
            </table>



        </div>
    )
}

export default PayFormula;