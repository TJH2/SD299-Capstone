import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { WorkOrder } from "./WorkOrder.jsx"; // WORK ORDER FORM COMPONENT
import "../styles/dashboard.css";

export function Dashboard() {

    const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES

    function HandleLogOut() {

        sessionStorage.removeItem("employeeID");
        navigate('/');
    }

    return <> 
        <button onClick={HandleLogOut}>Log Out</button>
        <WorkOrder />
    </>
   }