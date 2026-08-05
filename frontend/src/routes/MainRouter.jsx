import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import PrivateRoutes from "./PrivateRoutes";
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
                    <Route path={"/"} element={<HomePage />} />
                </Route>
            </Routes>
            <Toaster />
        </>
    );
}
