import { Outlet, Navigate } from "react-router-dom";
import React from "react";
const ProtectedRoutes = () => {
  const user = localStorage.getItem("user");
  return user ? <Outlet /> : <Navigate to="/login" />;
};
export default ProtectedRoutes;
