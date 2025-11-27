import React, { useEffect, useState } from "react";
import ProjectCard from "../Projects/ProjectCard";
import ProjectModal from "./ProjectModal";
import "../Projects/ProjectDashboard.css";
import { FaThLarge, FaBars, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const STATUS_BUTTONS = [
  { key: "all", label: "All Projects" },
  { key: "in-progress", label: "Active Projects" },
  { key: "todo", label: "Upcoming Projects" },
  { key: "completed", label: "Completed Projects" },
];

export default function ProjectsDashboard() {

  const navigate = useNavigate();

  const openProjectDetails = (id) => {
    navigate(`/projects/${id}`);
  };
  const [viewType, setViewType] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  let Userrole = sessionStorage.getItem("Role")
  const API_URL = import.meta.env.VITE_API_URL;
  const [membersOptions, setMembersOptions] = useState([]);

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
      setMembersOptions(formatted);
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token"); // or localStorage
      const res = await axios.get(`${API_URL}/api/project/allprojects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(res.data.projects);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setLoading(false);
    }
  };

  // 🔹 Load on mount
  useEffect(() => {
    loadProjects();
    loadMembers();
  }, []);

  // 🔹 Auto refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadProjects();
    }, 120000); // 120000ms = 2 mins

    return () => clearInterval(interval);
  }, []);

  // 🔹 After Add/Edit → reload API
  const handleProjectSaved = () => {
    loadProjects();
    setShowModal(false);
    setEditProject(null);
  };

  // 🔹 Filtering applied on API results
  const displayProjects =
    statusFilter === "all"
      ? projects
      : projects.filter((p) => p.status === statusFilter);

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
              <FaPlus className="plus" /> Add Project
            </button>}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : viewType === "grid" ? (
        <div className="proj-content grid">
          {displayProjects.length === 0 ? (
            <div className="empty">No projects found</div>
          ) : (
            displayProjects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
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
            {displayProjects.length === 0 ? (
              <div className="empty">No projects found</div>
            ) : (
              displayProjects.map((p) => (
                <ProjectCard
                  key={p._id}
                  project={p}
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
        <ProjectModal
          visible={showModal}
          initialData={editProject}
          membersOptions={membersOptions}
          onClose={() => {
            setShowModal(false);
            setEditProject(null);
          }}
          onSaved={handleProjectSaved}
        />
      )}
    </div>
  );
}
