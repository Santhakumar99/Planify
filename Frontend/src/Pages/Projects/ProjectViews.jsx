import React, { useState, useEffect } from "react";
import "../Projects/ProjectView.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../CommonComponents/DateFormat.jsx";
import ProjectModal from "./ProjectModal";
import DeleteConfirm from "../CommonComponents/DeleteConfirm";
import { useToast } from "../CommonComponents/Toast/ToastProvider";


const ProjectOverview = () => {
    const { showToast } = useToast();
    const { id } = useParams();
    let Userrole = sessionStorage.getItem("Role")
    const API_URL = import.meta.env.VITE_API_URL;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();
    const handleDeleteProject = async () => {
        try {
            setDeleteLoading(true);

            const token = sessionStorage.getItem("token");
            const res = await axios.delete(`${API_URL}/api/project/deleteProject/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res?.data?.message)
            showToast((res?.data?.message|| "Project deleted!"), "success");
            navigate("/projects");
        } catch (error) {
            console.error("DELETE PROJECT ERROR:", error);
            // alert(error.response?.data?.message || "Failed to delete project");
        } finally {
            setDeleteLoading(false);
        }
    };
      
    
    const loadMembers = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await axios.get(`${API_URL}/api/user/allusers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res)
            // Convert API structure → modal structure
            const formatted = res.data.allUsers.map((u) => ({
                id: u._id,
                name: u.name,
                email: u.email,
            }));
            console.log(formatted)
            setProjectMembers(formatted);
        } catch (err) {
            console.error("Failed to load members:", err);
        }
      };
    const loadProject = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");

            const res = await axios.get(`${API_URL}/api/project/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProject(res.data.project);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch project:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProject();
        loadMembers();
    }, [id]);
  console.log(project)
    return (
        <div className="project-container">

            {/* Header Section */}
            <div className="project-header">
                <div>
                    <h2 className="project-title">{project?.name}</h2>
                    {/* <p className="project-subtitle">{project ? project?.description : "-"}</p> */}

                    <div className="tags">
                        <span className="tag yellow">{project ? project?.status : "-"}</span>
                        <span className="tag red">High Priority</span>
                    </div>
                </div>

                <div className="header-right">
                    <div>
                        {Userrole !== "employee" && (
                            <div className="action-buttons">
                                <button
                                    className="btn-action edit"
                                    onClick={() => {
                                        setEditProject(project);
                                        setShowModal(true);
                                    }}
                                >
                                    <span className="icon">✏️</span>
                                    <span>Edit</span>
                                </button>

                                <button
                                    className="btn-action delete"
                                    onClick={() => setShowDelete(true)}
                                >
                                    <span className="icon">🗑️</span>
                                    <span>Delete</span>
                                </button>
                            </div>
                  
                 
                        )}
                        {/* <p className="label">Deadline:</p>
                        <p className="value">{project ? formatDate(project?.endDate) : "-"}</p> */}
                    </div>
                    <div>
                        {/* <p className="label">Started:</p>
                        <p className="value">{project ? formatDate(project?.startDate) : "-"}</p> */}
                    </div>
                </div>
            </div>
            {/* Stats Section - Modern UI */}
            <div className="stats-wrapper">
                <div className="stat-box">
                    <div className="stat-header">Progress</div>

                    <div className="stat-value">{project?.stats?.progress ?? 0}%</div>

                    <div className="progress-track">
                        <div
                            className="progress-fill-modern"
                            style={{ width: `${project?.stats?.progress ?? 0}%` }}
                        />
                    </div>

                    <p className="stat-sub">24 tasks (16 completed)</p>
                </div>

                <div className="stat-box">
                    <div className="stat-header">Deadline</div>
                    <div className="stat-big">{project ? formatDate(project.endDate) : "-"}</div>
                </div>

                <div className="stat-box">
                    <div className="stat-header">Start Date</div>
                    <div className="stat-big">{project ? formatDate(project.startDate) : "-"}</div>
                </div>

                <div className="stat-box">
                    <div className="stat-header">Days Left</div>
                    <div className="stat-big">{project?.stats?.daysLeft ?? 0}</div>
                </div>
            </div>


            <div className="tabs">
                {/* <button className="tab active">Overview</button>
                <button className="tab">Tasks</button>
                <button className="tab">Team</button>
                <button className="tab">Discussions</button>
                <button className="tab">Analytics</button> */}
            </div>

            <div className="content-grid">
                <div className="info-card">
                    <h3 className="info-title">Project Details</h3>

                    <div className="info-item">
                        <p className="label">Name</p>
                        <p className="value">{project?.name}</p>
                    </div>

                    <div className="info-item">
                        <p className="label">Description</p>
                        <p className="value">{project?.description}</p>
                    </div>

                    <div className="info-item">
                        <p className="label">Start Date</p>
                        <p className="value">{formatDate(project?.startDate)}</p>
                    </div>

                    <div className="info-item">
                        <p className="label">Deadline</p>
                        <p className="value">{formatDate(project?.endDate)}</p>
                    </div>

                    <div className="info-item">
                        <p className="label">Created By</p>
                        <div className="member-row">
                            <div className="avatar-circle sm">
                                {project?.createdBy?.name.charAt(0)}
                            </div>
                            <span className="member-name">{project?.createdBy?.name}</span>
                        </div>
                    </div>
                </div>
                <div className="info-card">
                    <h3 className="info-title">Team Members</h3>

                    {project?.members?.length > 0 ? (
                        <>
                            {project.members.slice(0, 6).map((m) => (
                                <div className="member-row" key={m._id}>
                                    <div className="avatar-circle sm">
                                        {m.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="member-name">{m.name}</span>
                                </div>
                            ))}

                            {project.members.length > 6 && (
                                <div className="more-members">+{project.members.length - 6} more</div>
                            )}
                        </>
                    ) : (
                        <p className="no-members">No team members added.</p>
                    )}
                </div>
                <ProjectModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    initialData={editProject}   // <-- important
                    onSaved={() => {
                        setShowModal(false);
                        loadProject();  // refresh after update
                    }}
                    membersOptions={projectMembers || []}
                />
                <DeleteConfirm
                    visible={showDelete}
                    message="Are you sure you want to delete this project?"
                    onClose={() => setShowDelete(false)}
                    onConfirm={handleDeleteProject}
                    loading={deleteLoading}
                />

            </div>
        </div>
    );
};

export default ProjectOverview;
