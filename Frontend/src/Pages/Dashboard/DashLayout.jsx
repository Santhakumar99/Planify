import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "../Dashboard/dashboard.css";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout">

      {/* Only pass isOpen */}
      <Sidebar isOpen={isSidebarOpen} />

      <div className="content-area">
        <Header 
          title="Dashboard"
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="page-body">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
