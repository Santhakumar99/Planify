
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Context";
import DashboardLayout from "../Pages/Dashboard/DashLayout"; 
// import Header from "../Header/Header";

const ProtectedLayout = () => {
const { user, loading } = useAuth();
  const location = useLocation();
 // Wait until auth state finishes initializing
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;


  return (
   
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedLayout;
