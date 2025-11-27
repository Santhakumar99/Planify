// src/API/TaskAPIs.jsx
import api from "../Utils/ApiInstance.jsx";

export const fetchTasksByProject = (projectId) => api.get(`/api/task/${projectId}`);
export const createTask = (formData) =>
  api.post("/api/task/createTask", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateTask = (id, formData) =>
  api.put(`/api/task/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteTask = (id) => api.delete(`/api/task/${id}`);
export default { fetchTasksByProject, createTask, updateTask, deleteTask };


