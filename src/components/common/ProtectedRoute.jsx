import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    if (user?.role === "customer") return <Navigate to="/customer/dashboard" />;
    if (user?.role === "provider") return <Navigate to="/provider/dashboard" />;
    if (user?.role === "admin") return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
