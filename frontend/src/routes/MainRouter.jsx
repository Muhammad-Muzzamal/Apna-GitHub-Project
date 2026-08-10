import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "../pages/dashboard/Dashboard";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import NewRepository from "../pages/repository/NewRepository";
import NotFound from "../pages/NotFound";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

export default function MainRouter() {
    return (
        <>
            <Routes>
                {/* Dashboard is public — anyone can view the profile landing page */}
                <Route path="/" element={<Dashboard />} />

                {/* Public auth routes (redirect away if already logged in) */}
                <Route element={<PublicRoutes />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                </Route>

                {/* Private routes — require auth */}
                <Route element={<PrivateRoutes />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/repo/new" element={<NewRepository />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#161b22",
                        color: "#e6edf3",
                        border: "1px solid #30363d",
                        fontSize: "13px",
                    },
                }}
            />
        </>
    );
}
