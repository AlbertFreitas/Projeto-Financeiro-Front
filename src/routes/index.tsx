import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import  {AuthProvider } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";

import PrivateRoutes from "./PrivateRoutes";
import AppLayout from "../layout/AppLayout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />


                    <Route element={<PrivateRoutes />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                    </Route>


                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRoutes;