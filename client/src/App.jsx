import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { WorkOrder } from "./pages/WorkOrder.jsx";


function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={ <Login />} />
        <Route path="/dashboard" element={ <Dashboard />} />
        <Route path="/workorder" element={ <WorkOrder />} />
      </Routes>
      
    </>
  )
}

export default App
