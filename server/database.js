const sqlite3 = require("sqlite3").verbose();

const dbName = "demoDatabase.db";

let db = new sqlite3.Database(dbName, (err) => {
    if(err) { console.error(err.message) }
    else { console.log("CONNECTED TO DATABASE")

    db.run('CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, department TEXT, position TEXT, email TEXT)', (err) => {
        if(err) { console.error(err.message) }
    else { console.log("EMPLOYEES TABLE CREATED/EXISTS")}
    })

    db.run('CREATE TABLE IF NOT EXISTS forms (id INTEGER PRIMARY KEY AUTOINCREMENT, request_type TEXT, asset TEXT, location TEXT, priority TEXT, deadline TEXT, request_description TEXT, request_update TEXT, employee TEXT, employee_contact TEXT, assigned TEXT DEFAULT "UNASSIGNED" NOT NULL, assigned_contact TEXT, status TEXT DEFAULT "UNASSIGNED" NOT NULL)', (err) => {
        if(err) { console.error(err.message) }
    else { console.log("FORMS TABLE CREATED/EXISTS")}
    })

    // STATUS CYCLE MAINTENANCE MANAGER (UNASSIGNED, ASSIGNED) -> MAINTENANCE EMPLOYEE (IN PROGRESS, COMPLETE)

    }
})

module.exports = db