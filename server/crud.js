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
const createRequest = (created_on, request_type, asset, location, priority, deadline, request_description, employee, employee_contact, employee_department, callback) => {
    const sql = `INSERT INTO forms (created_on, request_type, asset, location, priority, deadline, request_description, employee, employee_contact, employee_department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    db.run(sql, [created_on, request_type, asset, location, priority, deadline, request_description, employee, employee_contact, employee_department], function(err) {
        callback(err, {id: this.lastID})
    })
}

// MANAGER ASSIGNING FORM TO MAINTENANCE WORKER
const assignRequest = (id, assigned, assigned_contact, status, callback) => {
    const sql = `UPDATE forms SET assigned = ?, assigned_contact = ?, status = ? WHERE id = ?`
    db.run(sql, [assigned, assigned_contact, status, id], callback )
}

// TECHNICIAN UPDATING FORM
const updateRequestMessage = (id, request_update, callback) => {
    const sql = `UPDATE forms SET request_update = ? WHERE id = ?`
    db.run(sql, [request_update, id], callback )
}

// TECHNICIAN UPDATING FORM
const updateRequestStatus = (id, status, callback) => {
    const sql = `UPDATE forms SET status = ? WHERE id = ?`
    db.run(sql, [status, id], callback )
}

// DELETE FORM
const deleteRequest = (id, callback) => {
    const sql = `DELETE FROM forms WHERE id = ?`
    db.run(sql, id, callback)
}

module.exports = { readEmployees, createEmployee, findEmployee, deleteEmployee, readRequests, createRequest, assignRequest, updateRequestMessage, updateRequestStatus, deleteRequest }