
import React, { useState, useRef, useEffect } from "react";
import {
  FiBell,
  FiSearch,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import "../Header/Header.css";
import {useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/Context";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/Slices/authSlice";
const Header = ({ title, isSidebarOpen, toggleSidebar }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();
  let username = user?.name;
  let role = user?.role;
  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const LogoutPage = ()=>{
    dispatch(logout())
    navigate("/login")
}
  return (
    <header className="app-header">
    <div className="hamburger-icon" onClick={toggleSidebar}>
        {isSidebarOpen ?
        <FaArrowLeftLong />
          // <FiX size={22} />
          :
          <FaArrowRightLong />
          // <FiMenu size={22} />
        }
</div>

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
        <div
          className="header-profile"
          onClick={() => setOpenPopup(!openPopup)}
          ref={popupRef}
        >
          <img
            src="https://randomuser.me/api/portraits/women/45.jpg"
            alt="profile"
          />

          {/* Popup */}
  {openPopup && (
    <div className="profile-popup">
      {/* Top Profile Info */}
              <div className="popup-header">
                <div className="imageSec">
                <img
        src="https://randomuser.me/api/portraits/women/45.jpg"
        alt="profile"
        className="popup-profile-img"
      />
                </div>
                <div className="textSecion">
                <h4>{username}</h4>
        <p>{role}</p>
     </div>

      </div>

      <div className="divider"></div>

      {/* Menu Items */}
      <div className="popup-item">
        <FiUser className="icon" /> Profile
      </div>

      {/* <div className="popup-item">
        <FiMail className="icon" /> Mail Inbox
      </div>

      <div className="popup-item file-manager">
        <FiFolder className="icon" /> File Manager
        <span className="badge">2</span>
      </div>

      <div className="popup-item">
        <FiSettings className="icon" /> Settings
      </div>

      <div className="popup-item">
        <FiHelpCircle className="icon" /> Help
      </div> */}

      <div className="divider"></div>

              <div className="popup-item logout" onClick={LogoutPage} >
        <FiLogOut className="icon" /> Log Out
      </div>
    </div>
  )}
        </div>
      </div>
    </header>
  );
};

export default Header;
