import { FiHome, FiFolder, FiUsers } from "react-icons/fi";

export const menuConfig = [
    {
        path: "/dashboard",
        label: "Dashboard",
        icon: FiHome,
        roles: ["manager", "employee"], // who can see
    },
    {
        path: "/projects",
        label: "Projects",
        icon: FiFolder,
        roles: ["manager"],
    },
    {
        path: "/tasks",
        label: "Tasks",
        icon: FiFolder,
        roles: ["manager", "employee"],
    },
    {
        path: "/users",
        label: "Users",
        icon: FiUsers,
        roles: ["manager"],
    },
];
