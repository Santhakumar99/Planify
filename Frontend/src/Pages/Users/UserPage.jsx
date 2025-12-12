import React, { useEffect, useState } from "react";
import UserModal from "./UserModal";
import { fetchUsers } from "./UserAPIs";
import "../../Pages/Projects/ProjectDashboard";
import { FaThLarge, FaBars, FaPlus } from "react-icons/fa";
import axios from "axios";
import ProjectCard from "../Projects/ProjectCard";
import UserCard from "./UserCard";
import UserListRow from "./UserList";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [viewType, setViewType] = useState("grid");
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    let Userrole = sessionStorage.getItem("Role");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editProject, setEditProject] = useState(null);


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const res = await axios.get(`${API_URL}/api/user/allusers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data?.allUsers);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const STATUS_BUTTONS = [
        { key: "all", label: "All Users" },
        { key: "Active", label: "Active Users" },
        { key: "Inacive", label: "Blocked Users" },
    ];

    const displayUsers =
        statusFilter === "all"
            ? users
            : statusFilter === "Active"
                ? users.filter((u) => u.isBlocked === false)
                : users.filter((u) => u.isBlocked === true);

    return (
        <div className="proj-dashboard page-wrapper">
            <div className="proj-header">
                <div className="status-buttons-left">
                    {STATUS_BUTTONS.map((b) => (
                        <button
                            key={b.key}
                            className={`status-btn ${statusFilter === b.key ? "active" : ""}`}
                            onClick={() => setStatusFilter(b.key)}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>

                <div className="header-controls-right">
                    <div className="view-toggle">
                        <button
                            className={`icon-btn ${viewType === "grid" ? "active" : ""}`}
                            onClick={() => setViewType("grid")}
                        >
                            <FaThLarge />
                        </button>
                        <button
                            className={`icon-btn ${viewType === "list" ? "active" : ""}`}
                            onClick={() => setViewType("list")}
                        >
                            <FaBars />
                        </button>
                    </div>
                    {Userrole && Userrole != "employee" &&
                        <button
                            className="btn-add"
                            onClick={() => {
                                setEditProject(null);
                                setShowModal(true);
                            }}
                        >
                            <FaPlus className="plus" /> Add User
                        </button>}
                </div>
            </div>

            {/* CONTENT */}
            {loading ? (
                <div className="loading">Loading users...</div>
            ) : viewType === "grid" ? (
                <div className="proj-content grid">
                    {displayUsers.length === 0 ? (
                        <div className="empty">No users found</div>
                    ) : (
                        displayUsers.map((p) => (
                            // <UserCard user={p}/>
                            <UserCard
                                key={p._id}
                                user={p}
                                viewType="grid"
                                onView={() => openProjectDetails(p._id)}
                                onEdit={() => {
                                    setEditProject(p);
                                    setShowModal(true);
                                }}
                            />
                        ))
                    )}
                </div>
            ) : (
                <div className="proj-content list-wrapper">
                    <div className="proj-content list">
                        {displayUsers.length === 0 ? (
                            <div className="empty">No users found</div>
                                ) : (
                     displayUsers.map((p) => (
                                <UserListRow
                                    key={p._id}
                                    user={p}
                                    viewType="list"
                                    onView={() => openProjectDetails(p._id)}
                                    onEdit={() => {
                                        setEditProject(p);
                                        setShowModal(true);
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <UserModal
                    visible={showModal}
                    // initialData={editProject}
                    // membersOptions={membersOptions}
                    onClose={() => {
                        setShowModal(false);
                        setEditUser(null);
                    }}
                    // onSaved={handleProjectSaved}
                />
            )}
        </div>
    );
};

export default UsersPage;
