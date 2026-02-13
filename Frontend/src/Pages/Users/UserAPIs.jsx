import api from "../Utils/ApiInstance";

export const fetchUsers = async () => {
    const res = await api.get("/user/allusers");
    return res.data;
};

export const createUser = async (data) => {
    const res = await api.post("/user/register", data);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await api.put(`/user/${id}`, data);
    return res.data;
};

