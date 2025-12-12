// src/API/TaskAPIs.jsx
import api from "../Utils/ApiInstance.jsx";

export const fetchTasksByProject = (projectId) =>
  api.get(`/api/task/${projectId}`);

export const createTask = (payload) => {
  const token = sessionStorage.getItem("token");

  return api.post("/api/task/createTask", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTask = (id, payload) => {
  const token = sessionStorage.getItem("token");

  return api.put(`/api/task/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTask = (id) => {
  const token = sessionStorage.getItem("token");

  return api.delete(`/api/task/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default { fetchTasksByProject, createTask, updateTask, deleteTask };
