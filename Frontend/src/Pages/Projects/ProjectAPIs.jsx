import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

//  Add Authorization token automatically
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions
export const createProject = (payload) => api.post("/api/project/addProject", payload);
export const updateProject = (id, payload) => api.put(`/api/projects/${id}`, payload);
export const fetchProjects = () => api.get("/api/projects");
export const fetchMembers = () => api.get("/api/users");

export default api;
