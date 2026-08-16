import { Navigate, Outlet } from 'react-router-dom';

import React from 'react'
import { useAuth } from '../context/AuthContext';

const PublicRoutes = () => {

    const { currentUser } = useAuth();

    if (currentUser) {
        return <Navigate to={"/"} replace />
    }

    return <Outlet />
}

export default PublicRoutes