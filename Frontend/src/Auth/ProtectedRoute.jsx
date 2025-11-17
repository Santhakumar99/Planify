import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Context";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {

  const { user, loading } = useAuth();
  if (loading) return null; // or return a spinner

  if (!user) return <Navigate to="/login" replace />;

  // If roles provided, validate; otherwise allow any authenticated user
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
