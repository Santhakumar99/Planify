// src/api.js
import axios from "axios";
  const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL || "", // set in .env if needed
  headers: {
    "Content-Type": "application/json",
  },
});

export const createProject = (payload) => api.post("/api/projects", payload);
export const updateProject = (id, payload) => api.put(`/api/projects/${id}`, payload);
export const fetchProjects = () => api.get("/api/projects");
export const fetchMembers = () => api.get("/api/users"); // example endpoint to get members

export default api;
