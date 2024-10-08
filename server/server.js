const express = require("express");
const cors = require("cors");
const {readEmployees, createEmployee, findEmployee, deleteEmployee, readRequests, createRequest, assignRequest, deleteRequest} = require("./crud");
const app = express();

app.use(cors());
app.use(express.json());


// CREATE NEW EMPLOYEE. POSITION SHOULD BE "EMPLOYEE" OR "MANAGER"
app.post('/new-employee', (request, response) => {
    const {email, name, password, department, position} = request.body;
    createEmployee(email, name, password, department, position, (err, data) => {
        if(err){
            response.status(500).send(err.message)
        } else {
            response.status(201).send(`EMPLOYEE CREATED WITH EMAIL: ${email}`)
        }
    })
})

// SEARCH FOR ALL EMPLOYEES
app.get('/employees', (request, response) => {
    readEmployees((err, data) => {
        if(err){
            response.status(500).send(err.message)
        } else {
            response.status(200).json(data)
        }
    })
})

// SEARCH FOR A PECIFIC EMPLOYEE BY EMAIL & PASSWORD. USED FOR LOGGING IN
app.get('/employee', (request, response) => {
    const email = request.query.email;
    const password = request.query.password;
    findEmployee(email, password, (err, data) => {
        if(err){
            response.status(500).send(err.message)
        } else {

            if (data.length === 0) { // MEANS INFO DOES NOT MATCH OUR RECORDS
                return response.status(404).json({message: "User not found"});
            }
            
            return response.status(200).json([data])
        }
    })
})

// DELETE A SPECIFIC EMPLOYEE BY ID
app.delete("/employee/:email", (request, response) => {
    deleteEmployee(request.params.email, (err) => {
        if(err){
            response.status(500).send(err.message)
        } else {
            response.status(200).json("EMPLOYEE DELETED")
        }
    })
})

// FORM ROUTES

// SEARCH FOR ALL REQUESTS
app.get('/requests', (request, response) => {
    readRequests((err, data) => {
        if(err){
            response.status(500).send(err.message)
        } else {
            response.status(200).json(data)
        }
    })
})

// DELETE WORK ORDER REQUEST
app.delete("/request/:id", (request, response) => {
    deleteRequest(request.params.id, (err) => {
        if(err){
            response.status(500).send(err.message)
        } else {
            response.status(200).json("WORK ORDER REQUEST DELETED")
        }
    })
})

// CREATE NEW FORM REQUEST.
app.post('/new-request', (request, response) => {
    const {request_type, asset, location, priority, deadline, request_description, employee, employee_contact, employee_department} = request.body;
    createRequest(request_type, asset, location, priority, deadline, request_description, employee, employee_contact, employee_department, (err, data) => {
        if(err){
            response.status(500).send(err.message)
        } else {
            response.status(201).send(`NEW WORK ORDER REQUEST CREATED FOR: ${asset}`)
        }
    })
})

app.listen(3000, () => {
    console.log("CONNECTED TO SERVER")
})