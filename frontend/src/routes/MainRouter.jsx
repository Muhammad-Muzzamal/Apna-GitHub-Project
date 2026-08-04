import { Route, Routes } from "react-router-dom";

import GuestRoutes from "./GuestRoutes";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import { Toaster } from "react-hot-toast";

export default function MainRouter() {
    return (
        <>
            <Routes>
                <Route path={"/"} element={<HomePage />} />
                <Route element={<GuestRoutes />}>
                    <Route path={"/login"} element={<LoginPage />} />
                    <Route path={"/signup"} element={<SignUpPage />} />
                </Route>
            </Routes>
            <Toaster />
        </>
    );
}
