// // Sidebar.jsx
// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import '../Sidebar/Sidebar.css';

// const Sidebar = ({ isExpanded, onExpand, onCollapse }) => {
//   const navigate = useNavigate();
//   const role = sessionStorage.getItem('Role');

//   const handleLogout = () => {
//     localStorage.removeItem('role');
//     navigate('/login');
//   };

//   return (
//     <div
//       className={`sidebar ${isExpanded ? 'expanded' : ''}`}
//       onMouseEnter={onExpand}
//       onMouseLeave={onCollapse}
//     >
//       <NavLink to="/dashboard" className="icon-link">
//         <div className="icon">🏠</div>
//         <span className="menu-text">Home</span>
//       </NavLink>

//       <NavLink to="/login" className="icon-link">
//         <div className="icon">📅</div>
//         <span className="menu-text">Calendar</span>
//       </NavLink>

//       {role === 'admin' && (
//         <NavLink to="/analytics" className="icon-link">
//           <div className="icon">📊</div>
//           <span className="menu-text">Analytics</span>
//         </NavLink>
//       )}

//       {role === 'admin' && (
//         <NavLink to="/settings" className="icon-link">
//           <div className="icon">⚙️</div>
//           <span className="menu-text">Settings</span>
//         </NavLink>
//       )}

//       <div className="icon-link logout" onClick={handleLogout}>
//         <div className="icon">↗️</div>
//         <span className="menu-text">Logout</span>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FiHome,
//   FiFolder,
//   FiClock,
//   FiUsers,
//   FiSettings,
//   FiLayers,
// } from "react-icons/fi";
// import "../Sidebar/sidebar.css";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div
//       className={`sidebar ${isOpen ? "open" : ""}`}
//       onMouseEnter={() => setIsOpen(true)}
//       onMouseLeave={() => setIsOpen(false)}
//     >
//       {/* Logo */}
//       <div className="sidebar-logo">
//         <span className="logo-icon">T</span>
//         {isOpen && <span className="logo-text">Task Manager</span>}
//       </div>

//       {/* Menu Items */}
//       <nav className="sidebar-menu">

//         <NavLink to="/dashboard" className="menu-item">
//           <FiHome className="icon" />
//           <span className="menu-text">Dashboard</span>
//         </NavLink>

//         <NavLink to="/projects" className="menu-item">
//           <FiFolder className="icon" />
//           <span className="menu-text">Projects</span>
//         </NavLink>

//         <NavLink to="/timelog" className="menu-item">
//           <FiClock className="icon" />
//           <span className="menu-text">Time log</span>
//         </NavLink>

//         <NavLink to="/resources" className="menu-item">
//           <FiLayers className="icon" />
//           <span className="menu-text">Resource mgmt</span>
//         </NavLink>

//         <NavLink to="/users" className="menu-item">
//           <FiUsers className="icon" />
//           <span className="menu-text">Users</span>
//         </NavLink>

//         <NavLink to="/settings" className="menu-item">
//           <FiSettings className="icon" />
//           <span className="menu-text">Settings</span>
//         </NavLink>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // DEFAULT OPEN

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="closeSection">
       
        <div className="toggle-btn">
          <span className="appTitle">Planify</span>
        </div>
         <div className="iconsection" onClick={() => setIsOpen(!isOpen)}>
          <FaArrowLeftLong />
        </div>
      </div>
      {/* Toggle Button */}

      <nav className="menu">
        <NavLink to="/dashboard" className="menu-item">
          <FiHome className="icon" />
          {isOpen && <span className="menu-text">Dashboard</span>}
        </NavLink>

        <NavLink to="/projects" className="menu-item">
          <FiFolder className="icon" />
          {isOpen && <span className="menu-text">Projects</span>}
        </NavLink>

        <NavLink to="/timelog" className="menu-item">
          <FiClock className="icon" />
          {isOpen && <span className="menu-text">Time Log</span>}
        </NavLink>

        <NavLink to="/users" className="menu-item">
          <FiUsers className="icon" />
          {isOpen && <span className="menu-text">Users</span>}
        </NavLink>

        <NavLink to="/settings" className="menu-item">
          <FiSettings className="icon" />
          {isOpen && <span className="menu-text">Settings</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
