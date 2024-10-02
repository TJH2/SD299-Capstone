import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/login.css";

export function Login() {

    const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START
    const [employeeID, setEmployeeID] = useState(""); // HOLDS USERNAME VALUE OF USERNAME INPUT
    const [password, setPassword] = useState(""); // HOLDS PASSWORD VALUE OF PASSWORD INPUT

    useEffect(() => { // PREVENTS USER FROM GOING BACK TO LOGGIN PAGE IF ALREADY LOGGED IN
        if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
            initialized.current = true
            const employee = sessionStorage.getItem("employeeID"); // CHECKS SESSION STORAGE FOR EMPLOYEE INFORMATION
            if(employee) { // IF SESSION STORAGE EXISTS, EMPLOYEE MUST BE LOGGED IN SO GO TO HOMEPAGE
             navigate('/dashboard');
            }
    }}, [])

    function HandleLogIn(e) {
        e.preventDefault()

        if(employeeID !== "001" || password !== "password") { // CHECKS TO SEE IF USERS PUT IN A USERNAME & PASSWORD
            document.querySelector(".warning").innerText = "The Information Provided Does Not Match Our Records";
            document.querySelector(".warning").style.visibility = "visible";
            setPassword("");
            return;
        }
        sessionStorage.setItem("employeeID", employeeID);
        navigate('/dashboard');
    }

    return <>
            <h1>Centurión Maintenance</h1>
            <h2>Log In is "001" & "password" but try something else first!</h2>
            <form className="ls-form" onSubmit={(e)=>{HandleLogIn(e)}}>
            {/* handling for form when user submits on sign in or log in */} 
                <label htmlFor="employeeID">Employee ID:</label>
                <input type="text" id="employeeID" name="employeeID" value={employeeID} onChange={e => setEmployeeID(e.target.value)} maxLength={15} /><br/>
                <label htmlFor="employeePass">Password:</label>
                <input type="password" id="employeePass" name="employeePass" value={password} onChange={e => setPassword(e.target.value)} maxLength={15} /><br />
                <p className="warning">placeholder</p>
                <button>Log In</button>
            </form>
    </>
   }