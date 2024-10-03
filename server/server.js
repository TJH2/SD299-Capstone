const express = require("express");
const cors = require("cors");
const {createEmployee, findEmployee, readEmployees, createForm, assignForm, deleteForm} = require("./crud");
const app = express();

app.use(cors());
app.use(express.json());


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

// SEARCH FOR A PECIFIC EMPLOYEE BY ID & PASSWORD. USED FOR LOGGING IN
app.get('/employee', (request, response) => {
    const id = request.query.id;
    const password = request.query.password;
    findEmployee(id, password, (err, data) => {
        if(err){
            response.status(500).send(err.message)
        } else {

            if (data.length === 0) { // MEANS INFO DOES NOT MATCH OUR RECORDS
                return response.status(404).json({message: "User not found"});
            }
            
            return response.status(200).json([data[0].name, data[0].position])
        }
    })
})

// CREATE NEW EMPLOYEE. POSITION SHOULD BE "EMPLOYEE" OR "MANAGER"
app.post('/new-employee', (request, response) => {
    const {name, password, department, position, email} = request.body;
    createEmployee(name, password, department, position, email, (err, data) => {
        if(err){
            response.status(500).send(err.message)
        } else {
            response.status(201).send(`EMPLOYEE CREATED WITH ID: ${data.id}`)
        }
    })
})

app.listen(3000, () => {
    console.log("CONNECTED TO SERVER")
})