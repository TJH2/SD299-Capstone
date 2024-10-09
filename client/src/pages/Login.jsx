import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"

export function Login() {

    const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START
    const [employeeEmail, setEmployeeEmail] = useState(""); // HOLDS USERNAME VALUE OF USERNAME INPUT
    const [password, setPassword] = useState(""); // HOLDS PASSWORD VALUE OF PASSWORD INPUT
    const [isLog, setIsLog] = useState(true); // TO SWITCH BETWEEN LOGGING IN AND CREATING ACCOUNT

    const [employeeName, setEmployeeName] = useState("");
    const [employeeDepartment, setEmployeeDepartment] = useState("");
    const [employeePosition, setEmployeePosition] = useState("Employee");

    useEffect(() => { // PREVENTS USER FROM GOING BACK TO LOGGIN PAGE IF ALREADY LOGGED IN
        if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
            initialized.current = true
            const employee = sessionStorage.getItem("employeeName"); // CHECKS SESSION STORAGE FOR EMPLOYEE INFORMATION
            if(employee) { // IF SESSION STORAGE EXISTS, EMPLOYEE MUST BE LOGGED IN SO GO TO HOMEPAGE
             navigate('/dashboard');
            }
    }}, [])

    function HandleLogIn(e) { // LOG IN FUNCTION
        e.preventDefault()

        // AXIOS CALL TO SEE IF USERNAME IS IN OUR DATABASE
        axios.get('http://localhost:3000/employee', {
            params: {
                email: employeeEmail,
                password: password
            } 
        }).then(
            response => {
                        console.log(response.data[0][0]);
                        document.querySelector(".warning").style.visibility = "hidden";
                        sessionStorage.setItem("employeeName", response.data[0][0].name);
                        sessionStorage.setItem("employeeDepartment", response.data[0][0].department);
                        sessionStorage.setItem("employeePosition", response.data[0][0].position);
                        sessionStorage.setItem("employeeEmail", response.data[0][0].email);
                        navigate('/dashboard');    
        }).catch(error => { // IF USERNAME IS NOT FOUND
            document.querySelector(".warning").style.visibility = "visible";
            setPassword("");
            return;
        })
    }

    function HandleCreate(e) {
        e.preventDefault();
        axios.post('http://localhost:3000/new-employee', {
            email: employeeEmail,
            name: employeeName,
            password: password,
            department: employeeDepartment,
            position: employeePosition
        }).then(
            response => {
                        console.log(response.data[0][0]);
                        document.querySelector(".warning").style.visibility = "hidden";
                        sessionStorage.setItem("employeeName", employeeName);
                        sessionStorage.setItem("employeeDepartment", employeeDepartment);
                        sessionStorage.setItem("employeePosition", employeePosition);
                        sessionStorage.setItem("employeeEmail", employeeEmail);
                        navigate('/dashboard');    
        }).catch(error => { // IF USERNAME IS NOT FOUND
            document.querySelector(".warning").style.visibility = "visible";
            return;
        })

    }

    return <>

        { isLog ? 
            <form className="ls-form" onSubmit={(e)=>{HandleLogIn(e)}}>
                <h2>Log In Or <Link to="#" onClick={()=>{setIsLog(false)}}>Create Account</Link></h2>
                {/* handling for form when user submits on sign in or log in */} 
                <label htmlFor="employeeEmail">Employee Email:</label>
                <input type="text" id="employeeEmail" value={employeeEmail} onChange={e => setEmployeeEmail(e.target.value)} maxLength={15} /><br/>
                <label htmlFor="employeePass">Password:</label>
                <input type="password" id="employeePass" value={password} onChange={e => setPassword(e.target.value)} maxLength={15} />
                <p className="warning">The Information Provided Does Not Match Our Records</p>
                <button>Log In</button>
            </form>
        : 
            <form className="ls-form" onSubmit={(e)=>{HandleCreate(e)}}>
                <h2><Link to="#" onClick={()=>{setIsLog(true)}}>Log In</Link> Or Create Account</h2>
                {/* handling for form when user submits on sign in or log in */}
                <label htmlFor="employeeName">Employee Name:</label>
                <input type="text" id="employeeName" value={employeeName} onChange={e => setEmployeeName(e.target.value)} maxLength={15} /><br/> 
                <label htmlFor="employeeEmail">Employee Email:</label>
                <input type="text" id="employeeEmail" value={employeeEmail} onChange={e => setEmployeeEmail(e.target.value)} maxLength={15} /><br/>
                <label htmlFor="employeePass">Password:</label>
                <input type="password" id="employeePass" value={password} onChange={e => setPassword(e.target.value)} maxLength={15} /><br />
                <label htmlFor="employeeDepartment">Department:</label>
                <input type="text" id="employeeDepartment" value={employeeDepartment} onChange={e => setEmployeeDepartment(e.target.value)} maxLength={15} /><br/>
                <label htmlFor="employeePosition">Position:</label>
                <select id="employeePosition" value={employeePosition} onChange={e => setEmployeePosition(e.target.value)}>
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                </select>
                <p className="warning">There Was An Unexpected Error Creating This Employee</p>
                <button>Create Employee</button>
            </form> 
            }
    </>
   }