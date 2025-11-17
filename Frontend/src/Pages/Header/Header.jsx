import React from "react";
import { FiBell, FiSearch } from "react-icons/fi";
import "../Header/header.css";

const Header = ({ title }) => {
  return (
    <header className="app-header">
      <h2 className="header-title">{title}</h2>

      <div className="header-right">
        {/* Search */}
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        {/* Notification */}
        <div className="header-icon">
          <FiBell />
        </div>

        {/* Profile */}
        <div className="header-profile">
          <img
            src="https://randomuser.me/api/portraits/women/45.jpg"
            alt="profile"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
