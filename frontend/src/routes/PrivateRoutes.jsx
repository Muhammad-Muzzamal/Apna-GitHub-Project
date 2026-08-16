import { Navigate, Outlet } from 'react-router-dom'

import React from 'react'
import { useAuth } from '../context/AuthContext'

const PrivateRoutes = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to={"/login"} replace />
    }

    return <Outlet />
}

export default PrivateRoutes