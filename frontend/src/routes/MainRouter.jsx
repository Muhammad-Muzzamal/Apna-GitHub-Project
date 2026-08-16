import { Route, Routes, Navigate } from "react-router-dom";

import Dashboard from './../pages/dashboard/Dashboard';
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import NewRepository from './../pages/repository/NewRepository';
import NotFound from '../pages/NotFound';
import PrivateRoutes from "./PrivateRoutes";
import Profile from "../pages/user/Profile";
import PublicRoutes from "./PublicRoutes";
import SignUpPage from "../pages/auth/SignUpPage";
import { Toaster } from "react-hot-toast";

export default function MainRouter() {
    return (
        <>
            <Routes>
                <Route element={<PublicRoutes />}>
                    <Route path={"/login"} element={<LoginPage />} />
                    <Route path={"/signup"} element={<SignUpPage />} />
                </Route>

                <Route element={<PrivateRoutes />}>
                    <Route path={"/"} element={<Navigate to="/profile" replace />} />
                    <Route path={"/profile"} element={<HomePage />} />
                    <Route path={"/profile"} element={<Profile />} />
                    <Route path={"/dashboard"} element={<Dashboard />} />
                    <Route path={"/repo/new"} element={<NewRepository />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </>
    );
}
