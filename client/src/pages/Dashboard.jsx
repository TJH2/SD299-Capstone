import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { WorkOrder } from "./WorkOrder.jsx"; // WORK ORDER FORM COMPONENT
import "../styles/dashboard.css"; // STYLING FOR DASHBOARD PAGE

export function Dashboard() {

    const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES

    function HandleLogOut() { // LOG OUT FUNCTION

        sessionStorage.removeItem("employeeID");
        navigate('/');
    }

    return <>
        <header>
            <h1>Centurión Maintenance</h1>
            <button onClick={HandleLogOut}>Log Out</button>
        </header> 
        <WorkOrder />
    </>
   }