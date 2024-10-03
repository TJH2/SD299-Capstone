import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { WorkOrder } from "./WorkOrder.jsx"; // WORK ORDER FORM COMPONENT
import "../styles/dashboard.css"; // STYLING FOR DASHBOARD PAGE

export function Dashboard() {

    return <>
        <WorkOrder />
    </>
   }