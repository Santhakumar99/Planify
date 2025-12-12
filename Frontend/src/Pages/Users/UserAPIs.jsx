import axios from "axios";
const API_URL = "/api/users";

export const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const createUser = async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
};

export const fetchUserById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};
