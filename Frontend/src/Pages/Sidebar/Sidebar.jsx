import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiFolder,
  FiClock,
  FiUsers,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";
import "../Sidebar/sidebar.css";
import { useAuth } from "../../Auth/Context";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  let role = user?.role;

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="closeSection">
       
        <div className="toggle-btn">
          {isOpen ? <span className="appTitle">Planify</span> : <span className="appTitle">P</span>}
        </div>
         {/* <div className="iconsection" onClick={toggleSidebar}>
          <FaArrowLeftLong />
        </div> */}
      </div>
      {/* Toggle Button */}

      <nav className="menu">
        <NavLink to="/dashboard" className="menu-item">
          <FiHome className="icon" />
          {isOpen && <span className="menu-text">Dashboard</span>}
        </NavLink>
        {user && user?.role == "manager" &&
          <NavLink to="/projects" className="menu-item">
            <FiFolder className="icon" />
            {isOpen && <span className="menu-text">Projects</span>}
          </NavLink>
        }
          <NavLink to="/tasks" className="menu-item">
            <FiFolder className="icon" />
            {isOpen && <span className="menu-text">Tasks</span>}
          </NavLink>
        <NavLink to="/timelog" className="menu-item">
          <FiClock className="icon" />
          {isOpen && <span className="menu-text">Time Log</span>}
        </NavLink>
        {user && user?.role == "manager" &&
          <NavLink to="/login1" className="menu-item">
            <FiUsers className="icon" />
            {isOpen && <span className="menu-text">Users</span>}
          </NavLink>
        }

        <NavLink to="/login" className="menu-item">
          <FiSettings className="icon" />
          {isOpen && <span className="menu-text">Settings</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
