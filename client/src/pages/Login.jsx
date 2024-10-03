import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"
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

    function HandleLogIn(e) { // LOG IN FUNCTION
        e.preventDefault()

        // AXIOS CALL TO SEE IF USERNAME IS IN OUR DATABASE
        axios.get('http://localhost:3000/employee', {
            params: {
                id: employeeID,
                password: password
            } 
        }).then(
            response => {
                        console.log(response.data);
                        document.querySelector(".warning").style.visibility = "hidden";
                        sessionStorage.setItem("name", response.data[0]);
                        sessionStorage.setItem("position", response.data[1]);
                        navigate('/dashboard');    
        }).catch(error => { // IF USERNAME IS NOT FOUND
            document.querySelector(".warning").style.visibility = "visible";
            setPassword("");
            return;
        })
    }

    return <>
            <form className="ls-form" onSubmit={(e)=>{HandleLogIn(e)}}>
            {/* handling for form when user submits on sign in or log in */} 
                <label htmlFor="employeeID">Employee ID:</label>
                <input type="text" id="employeeID" name="employeeID" value={employeeID} onChange={e => setEmployeeID(e.target.value)} maxLength={15} /><br/>
                <label htmlFor="employeePass">Password:</label>
                <input type="password" id="employeePass" name="employeePass" value={password} onChange={e => setPassword(e.target.value)} maxLength={15} /><br />
                <p className="warning">The Information Provided Does Not Match Our Records</p>
                <button>Log In</button>
            </form>
    </>
   }