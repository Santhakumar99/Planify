import React from "react";
import "./UserCard.css";
import { FaPhone, FaEnvelope, FaEdit, FaTrash } from "react-icons/fa";

const UserCard = ({ user, onEdit, onDelete }) => {
    return (
        <div className="uc-card">
            {/* LEFT: Avatar */}
            <div className="uc-left">
                {user.img ? (
                    <img src={user.img} alt="avatar" className="uc-avatar" />
                ) : (
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt="avatar"
                        className="uc-avatar"
                    />
                )}

                {/* Status dot */}
                <span className={`uc-status ${user.isBlocked ? "blocked" : "active"}`}></span>
            </div>

            {/* RIGHT: Info */}
            <div className="uc-right">
                <h3 className="uc-name">{user.name}</h3>
                <p className="uc-username">@{user.email.split("@")[0]}</p>
                <p className="uc-company">{user.role || "User"}</p>

                {/* SPLIT SECTION */}
                <div className="uc-split">
                    {/* LEFT SIDE: Contact Info */}
                    <div className="uc-contact">
                        <div className="uc-row">
                            {/* <FaPhone className="uc-icon" /> */}
                            {/* <span>{user.mobile || "+91 00000 00000"}</span> */}
                            <h3 className="uc-name">{user.name}</h3>
                        </div>

                        <div className="uc-row">
                            <FaEnvelope className="uc-icon" />
                            <span>{user.email}</span>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Buttons */}
                    <div className="uc-actions">
                        <button className="uc-btn edit" onClick={() => onEdit(user)}>
                            <FaEdit />
                        </button>

                        <button className="uc-btn delete" onClick={() => onDelete(user)}>
                            <FaTrash />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
