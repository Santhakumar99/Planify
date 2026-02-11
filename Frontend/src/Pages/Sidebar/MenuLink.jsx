// import { NavLink } from "react-router-dom";

// const MenuLink = ({ to, icon: Icon, label, isOpen }) => {
//     return (
//         <NavLink
//             to={to}
//             end
//             className={({ isActive }) =>
//                 isActive ? "menu-item active" : "menu-item"
//             }
//         >
//             <Icon className="icon" />
//             {isOpen && <span className="menu-text">{label}</span>}
//         </NavLink>
//     );
// };
// // export default MenuLink;
// import { NavLink } from "react-router-dom";

// const MenuLink = ({ path, icon: Icon, label, isOpen }) => {
//     return (
//         <NavLink
//             to={path}
//             end
//             className={({ isActive }) =>
//                 isActive ? "menu-item active" : "menu-item"
//             }
//         >
//             <Icon className="icon" />
//             {isOpen && <span className="menu-text">{label}</span>}
//         </NavLink>
//     );
// };

// export default MenuLink;

import { NavLink, useLocation } from "react-router-dom";

const MenuLink = ({ path, icon: Icon, label, isOpen }) => {
    const location = useLocation();

    // Active if current path starts with the menu path
    const isActive = location.pathname.startsWith(path);

    return (
        <NavLink
            to={path}
            className={`menu-item ${isActive ? "active" : ""}`}
        >
            <Icon className="icon" />
            {isOpen && <span className="menu-text">{label}</span>}
        </NavLink>
    );
};

export default MenuLink;
