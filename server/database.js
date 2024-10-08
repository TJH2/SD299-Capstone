const sqlite3 = require("sqlite3").verbose();

const dbName = "CMDatabase.db";

let db = new sqlite3.Database(dbName, (err) => {
    if(err) { console.error(err.message) }
    else { console.log("CONNECTED TO DATABASE")

    db.run('CREATE TABLE IF NOT EXISTS employees (email TEXT PRIMARY KEY, name TEXT, password TEXT, department TEXT, position TEXT)', (err) => {
        if(err) { console.error(err.message) }
    else { console.log("EMPLOYEES TABLE CREATED/EXISTS")}
    })

    db.run('CREATE TABLE IF NOT EXISTS forms (id INTEGER PRIMARY KEY AUTOINCREMENT, request_type TEXT, asset TEXT, location TEXT, priority TEXT, deadline TEXT, request_description TEXT, request_update TEXT, employee TEXT, employee_contact TEXT, employee_department TEXT, assigned TEXT DEFAULT "Unassigned" NOT NULL, assigned_contact TEXT DEFAULT "None" NOT NULL, status TEXT DEFAULT "Unassigned" NOT NULL)', (err) => {
        if(err) { console.error(err.message) }
    else { console.log("FORMS TABLE CREATED/EXISTS")}
    })

    // STATUS CYCLE MAINTENANCE MANAGER (UNASSIGNED, ASSIGNED) -> MAINTENANCE EMPLOYEE (IN PROGRESS, COMPLETE)

    }
})

module.exports = db