const db = require("./database");

/* EMPLOYEE CRUD */

// CREATE EMPLOYEE
const createEmployee = (email, name, password, department, position, callback) => {
    const sql = `INSERT INTO employees (email, name, password, department, position) VALUES (?, ?, ?, ?, ?)`
    db.run(sql, [email, name, password, department, position], function(err) {
        callback(err, {id: this.lastID})
    })
}

// READ EMPLOYEES
const readEmployees = (callback) => {
    const sql = `SELECT * FROM employees`;
    db.all(sql, [], callback)
}

// FIND SPECIFIC EMPLOYEE FOR LOGGING IN
const findEmployee = (email, password, callback) => {
    const sql = `SELECT * FROM employees WHERE email = ? AND password = ?`;
    db.all(sql, [email, password], callback)
}

// DELETE EMPLOYEE

const deleteEmployee = (email, callback) => {
    const sql = `DELETE FROM employees WHERE email = ?`
    db.run(sql, email, callback)
}


/* FORM CRUD */

// READ ALL REQUESTS
const readRequests = (callback) => {
    const sql = `SELECT * FROM forms`;
    db.all(sql, [], callback)
}

// CREATE INITIAL FORM
const createRequest = (request_type, asset, location, priority, deadline, request_description, employee, employee_contact, callback) => {
    const sql = `INSERT INTO forms (request_type, asset, location, priority, deadline, request_description, employee, employee_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    db.run(sql, [request_type, asset, location, priority, deadline, request_description, employee, employee_contact], function(err) {
        callback(err, {id: this.lastID})
    })
}

// MANAGER ASSIGNING FORM TO MAINTENANCE WORKER
const assignRequest = (id, assigned, assigned_contact, callback) => {
    const sql = `UPDATE forms SET assigned = ?, assigned_conact = ? WHERE id = ?`
    db.run(sql, [assigned, assigned_contact, id], callback )
}

// DELETE FORM
const deleteRequest = (id, callback) => {
    const sql = `DELETE FROM forms WHERE id = ?`
    db.run(sql, id, callback)
}

module.exports = { readEmployees, createEmployee, findEmployee, deleteEmployee, readRequests, createRequest, assignRequest, deleteRequest }