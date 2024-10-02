import { useState } from 'react'
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { WorkOrder } from "./pages/WorkOrder.jsx";

function App() {

  return (
    <>
      <h1>Centurión Maintenance</h1>
      < Login />
      < Dashboard />
      < WorkOrder />
    </>
  )
}

export default App
