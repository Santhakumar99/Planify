import api from "../Utils/ApiInstance.jsx";
export const createProject = (payload) => api.post("/api/project/addProject", payload);
export const updateProject = (id, payload) => api.put(`/api/project/updateProject/${id}`, payload);
export const fetchProjects = () => api.get("/api/projects");
export const fetchMembers = () => api.get("/api/users");

export default { createProject, updateProject, fetchProjects, fetchMembers };
