import { useState } from 'react'
import './App.css'
import React from "react";
import Dashboard from './assets/components/Dashboard.jsx';
import Login from './assets/components/login.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Login />
    </>
  )
}

export default App
