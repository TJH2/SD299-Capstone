const sqlite3 = require("sqlite3").verbose();

const dbName = "CMDatabase.db";

let db = new sqlite3.Database(dbName, (err) => {
    if(err) { console.error(err.message) }
    else { console.log("CONNECTED TO DATABASE")

    db.run('CREATE TABLE IF NOT EXISTS employees (email TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, password TEXT NOT NULL, department TEXT NOT NULL, position TEXT NOT NULL)', (err) => {
        if(err) { console.error(err.message) }
    else { console.log("EMPLOYEES TABLE CREATED/EXISTS")}
    })

    db.run('CREATE TABLE IF NOT EXISTS forms (id INTEGER PRIMARY KEY AUTOINCREMENT, created_on TEXT NOT NULL, request_type TEXT NOT NULL, asset TEXT NOT NULL, location TEXT NOT NULL, priority TEXT NOT NULL, deadline TEXT NOT NULL, request_description TEXT NOT NULL, request_update TEXT, employee TEXT NOT NULL, employee_contact TEXT NOT NULL, employee_department TEXT NOT NULL, assigned TEXT DEFAULT "Unassigned" NOT NULL, assigned_contact TEXT DEFAULT "None" NOT NULL, status TEXT DEFAULT "Unassigned" NOT NULL)', (err) => {
        if(err) { console.error(err.message) }
    else { console.log("FORMS TABLE CREATED/EXISTS")}
    })

    // STATUS CYCLE MAINTENANCE MANAGER (UNASSIGNED, ASSIGNED) -> MAINTENANCE EMPLOYEE (IN PROGRESS, COMPLETE)

    }
})

module.exports = db