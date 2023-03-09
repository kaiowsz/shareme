import React, { useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoutes = () => {
    const [user, setUser] = useState<any>([])

    useEffect(() => {
        const userLocal = localStorage.getItem("user")

        setUser(userLocal)
    }, [])

    
    return (
        user ? <Outlet /> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes