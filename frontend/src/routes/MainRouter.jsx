import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import PrivateRoutes from "./PrivateRoutes";
import Profile from "../pages/user/Profile";
import PublicRoutes from "./PublicRoutes";
import SignUpPage from "../pages/auth/SignUpPage";
import { Toaster } from "react-hot-toast";
import NotFound from '../pages/NotFound';
import Dashboard from './../pages/dashboard/Dashboard';

export default function MainRouter() {
    return (
        <>
            <Routes>
                <Route element={<PublicRoutes />}>
                    <Route path={"/login"} element={<LoginPage />} />
                    <Route path={"/signup"} element={<SignUpPage />} />
                </Route>

                <Route element={<PrivateRoutes />}>
                    <Route path={"/"} element={<HomePage />} />
                    <Route path={"/profile"} element={<Profile />} />
                    <Route path={"/dashboard"} element={<Dashboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </>
    );
}
