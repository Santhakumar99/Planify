<<<<<<< HEAD
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
import "../Sidebar/Sidebar.css";
import { useAuth } from "../../Auth/Context";
=======
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FiHome,
//   FiFolder,
//   FiClock,
//   FiUsers,
//   FiSettings,
//   FiMenu,
// } from "react-icons/fi";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import "../Sidebar/sidebar.css";
// import { useAuth } from "../../Auth/Context";
// import { useSelector } from "react-redux";
// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   // const { user } = useAuth();
//   // let role = user?.role;
//   const user = useSelector(state => state.auth.user);
//   const data = useSelector(state => state);
//   const role = user?.role;
//   console.log(data)
>>>>>>> 5b62c0b (adding the modified files and sidebar issues fixed)

//   return (
//     <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
//       <div className="closeSection">

//         <div className="toggle-btn">
//           {isOpen ? <span className="appTitle">Planify</span> : <span className="appTitle">P</span>}
//         </div>
//       </div>

//       <nav className="menu">
//         <NavLink to="/dashboard" className="menu-item">
//           <FiHome className="icon" />
//           {isOpen && <span className="menu-text">Dashboard</span>}
//         </NavLink>
//         {role && role === "manager" &&
//           <NavLink to="/projects" className="menu-item">
//             <FiFolder className="icon" />
//             {isOpen && <span className="menu-text">Projects</span>}
//           </NavLink>
//         }
//           <NavLink to="/tasks" className="menu-item">
//             <FiFolder className="icon" />
//             {isOpen && <span className="menu-text">Tasks</span>}
//           </NavLink>
//         {role && role === "manager" &&
//           <NavLink to="/users" className="menu-item">
//             <FiUsers className="icon" />
//             {isOpen && <span className="menu-text">Users</span>}
//           </NavLink>
//         }
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

import { useSelector } from "react-redux";
import { menuConfig } from "./MenuConfig";
import MenuLink from "./Menulink";
import "../Sidebar/sidebar.css";

const Sidebar = ({ isOpen }) => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="closeSection">

        <div className="toggle-btn">
          {isOpen ? <span className="appTitle">Planify</span> : <span className="appTitle">P</span>}
        </div>
      </div>

      <nav className="menu">
        {menuConfig
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <MenuLink
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={item.label}
              isOpen={isOpen}
            />
          ))}
      </nav>
    </div>
  );
};
export default Sidebar;