const db = require("./database");

/* EMPLOYEE CRUD */

// CREATE EMPLOYEE
const createEmployee = (name, password, department, position, email, callback) => {
    const sql = `INSERT INTO employees (name, password, department, position, email) VALUES (?, ?, ?, ?, ?)`
    db.run(sql, [name, password, department, position, email], function(err) {
        callback(err, {id: this.lastID})
    })
}

// READ EMPLOYEES
const readEmployees = (callback) => {
    const sql = `SELECT * FROM employees`;
    db.all(sql, [], callback)
}

// FIND SPECIFIC EMPLOYEE FOR LOGGING IN
const findEmployee = (id, password, callback) => {
    const sql = `SELECT * FROM employees WHERE id = ? AND password = ?`;
    db.all(sql, [id, password], callback)
}


/* FORM CRUD */

// CREATE INITIAL FORM
const createForm = (request_type, asset, location, priority, deadline, request_description, employee, employee_contact) => {
    const sql = `INSERT INTO forms (request_type, asset, location, priority, deadline, request_description, employee, employee_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    db.run(sql, [request_type, asset, location, priority, deadline, request_description, employee, employee_contact], function(err) {
        callback(err, {id: this.lastID})
    })
}

// MANAGER ASSIGNING FORM TO MAINTENANCE WORKER
const assignForm = (id, assigned, assigned_contact, callback) => {
    const sql = `UPDATE forms SET assigned = ?, assigned_conact = ? WHERE id = ?`
    db.run(sql, [assigned, assigned_contact, id], callback )
}

// DELETE FORM
const deleteForm = (id, callback) => {
    const sql = `DELETE FROM forms WHERE id = ?`
    db.run(sql, id, callback)
}

module.exports = {createEmployee, findEmployee, readEmployees, createForm, assignForm, deleteForm}