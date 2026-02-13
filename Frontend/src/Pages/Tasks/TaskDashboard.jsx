import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import "../Projects/ProjectDashboard.css"; // reuse same styling
import { FaThLarge, FaBars, FaPlus } from "react-icons/fa";
import { fetchTasksByProject, deleteTask } from "../Tasks/TaskAPIs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteConfirm from "../CommonComponents/DeleteConfirm";
import { useToast } from "../CommonComponents/Toast/ToastProvider";
import { useLoading } from "../CommonComponents/LoadingProvider";
import { useSelector } from "react-redux";


const STATUS_BUTTONS = [
  { key: "all", label: "All Tasks" },
  { key: "todo", label: "Todo" },
  { key: "in-progress", label: "In Progress" },
  { key: "review", label: "In Review" },
  { key: "completed", label: "Completed" },
];

export default function TasksDashboard() {
  const navigate = useNavigate();

  const [viewType, setViewType] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  const [tasks, setTasks] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [membersOptions, setMembersOptions] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { showToast } = useToast();
  const { setLoading } = useLoading();
  const API_URL = import.meta.env.VITE_API_URL;

  const auth = useSelector(state => state.auth);
  const token = auth?.token;
  useEffect(() => {
    console.log("AUTH FROM REDUX:", JSON.parse(JSON.stringify(auth)));
  }, []);
  
  const openTaskDetails = (id) => {
    console.log(id)
    navigate(`/tasks/${id}`);
  };
  // Load all members (for assign dropdown)
  const loadMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/allusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.allUsers.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
      }));

      setMembersOptions(formatted);
    } catch (err) {
      console.error("Load members error", err);
    }
  };

  // Load all tasks
  const loadTasks = async () => {
    try {
      setLoadingLocal(true);
      const res = await axios.get(`${API_URL}/api/task/getAllTasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data.tasks || []);
      setLoadingLocal(false);
    } catch (err) {
      console.error("Load tasks error:", err);
      setLoadingLocal(false);
    }
  };

  useEffect(() => {
    loadTasks();
    loadMembers();
  }, []);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(loadTasks, 120000);
    return () => clearInterval(interval);
  }, []);

  // Filter logic (same as Projects)
  const displayTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  // Task delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteTask(deleteId);
      showToast("Task deleted successfully", "success");
      loadTasks();
    } catch (err) {
      showToast("Delete failed", "error");
    } finally {
      setShowDelete(false);
      setLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="proj-dashboard page-wrapper">
      {/* ------- HEADER -------- */}
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
          {/* Grid/List Toggle */}
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

          {/* Add Task */}
          <button
            className="btn-add"
            onClick={() => {
              setEditTask(null);
              setShowModal(true);
            }}
          >
            <FaPlus /> Add Task
          </button>
        </div>
      </div>

      {/* ------- CONTENT -------- */}
      {loadingLocal ? (
        <div className="loading">Loading tasks...</div>
      ) : viewType === "grid" ? (
        <div className="proj-content grid">
          {displayTasks.length === 0 ? (
            <div className="empty">No tasks found</div>
          ) : (
            displayTasks.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                viewType="grid"
                onEdit={() => {
                  setEditTask(t);
                  setShowModal(true);
                }}
                onView={() => openTaskDetails(t._id)}
                onDelete={() => {
                  setDeleteId(t._id);
                  setShowDelete(true);
                }}
              />
            ))
          )}
        </div>
      ) : (
        <div className="list-wrapper">
          <div className="proj-content list">
            {displayTasks.length === 0 ? (
              <div className="empty">No tasks found</div>
            ) : (
              displayTasks.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  viewType="list"
                  onEdit={() => {
                    setEditTask(t);
                    setShowModal(true);
                  }}
                  onView={() => openTaskDetails(t._id)}
                  onDelete={() => {
                    setDeleteId(t._id);
                    setShowDelete(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
      {/* ------- MODAL -------- */}
      {showModal && (
        <TaskModal
          visible={showModal}
          initialData={editTask}
          members={membersOptions}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
          onSaved={() => {
            setShowModal(false);
            loadTasks();
            setEditTask(null);
          }}
        />
      )}

      {/* DELETE POPUP */}
      <DeleteConfirm
        visible={showDelete}
        message="Are you sure you want to delete this task?"
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
