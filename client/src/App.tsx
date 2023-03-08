import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./container/Home"
import { Login } from "./components"
import PrivateRoutes from "./utils/PrivateRoutes"


function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login/>} />

      <Route element={<PrivateRoutes />}>
        <Route path="/*" element={<Home/>} />
      </Route>
    </Routes>
    </>  
  )
}

export default App