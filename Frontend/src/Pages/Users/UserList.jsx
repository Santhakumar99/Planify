import React from "react";
import "./UserList.css";

const UserListRow = ({ user, onView }) => {
    // Initial letters
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const status = user.isBlocked ? "Blocked" : "Active";

    return (
        <div className="user-row-card">

            {/* LEFT SECTION */}
            <div className="user-row-left">
                {/* COLORED INITIAL AVATAR */}
                <div
                    className="user-avatar"
                    style={{ backgroundColor: user.avatarColor }}
                >
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt="avatar"
                        className="user-avatar"
                    />
                </div>

                <div className="user-left-text">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role">{user.role}</div>
                </div>
            </div>

            {/* EMAIL */}
            <div className="user-email">{user.email}</div>

            {/* STATUS */}
            <div className="user-status">
                <span className={`status-dot ${status.toLowerCase()}`} />
                {status}
            </div>

            {/* VIEW BUTTON */}
            <button className="view-btn" onClick={onView}>
                View
            </button>
        </div>
    );
};

export default UserListRow;
