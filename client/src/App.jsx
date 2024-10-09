import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { Login } from "./pages/Login.jsx"; // LOG IN COMPONENT
import { Dashboard } from "./pages/Dashboard.jsx"; // EMPLOYEE DASHBOARD COMPONENT
import "./styles.css"; // STYLE FOR ENTIRE WEBSITE

function App() {

  return (
    <>

        <header>
            <h1>Centurión Maintenance</h1>
        </header> 

      <Routes>
                <Route element={<PrivateRoutes />} >
                    <Route path="/dashboard" element={<Dashboard />} /> { /* PATH TO DASHBOARD COMPONENT */ }
                </Route>
                <Route path="/" element={<Login />} /> { /* PATH TO LOG IN COMPONENT (FIRST PAGE OF WEBSITE) */ }
                <Route path="*" element={ <Navigate to="/" /> }  /> { /* REROUTES TO LOGIN IF RANDOM PATH IS TYPED IN */ }
            </Routes>
    </>
  )
}

// FUNCTION FOR PRIVATE ROUTES. HOMEPAGE IS A PRIVATE ROUTE AND ISN'T AVAILABLE UNTIL A USER LOGS IN. ENSURES USERS DON'T MANUALLY PUT HOMEPAGE INTO THE SEARCH BAR
const PrivateRoutes = () => {
  const employee = sessionStorage.getItem("employeeName"); // CHECKS SESSION STORAGE FOR EMPLOYEE INFORMATION
  return (
      employee ? <Outlet /> : <Navigate to="/" />
  );
};

export default App
