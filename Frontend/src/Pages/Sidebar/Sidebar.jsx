import { useSelector } from "react-redux";
import { menuConfig } from "./MenuConfig";
import MenuLink from "./MenuLink";
import "../Sidebar/sidebar.css";

const Sidebar = ({ isOpen }) => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="closeSection">

        <div className="toggle-btn">
          {isOpen ? <span className="appTitle">Planify</span> : <span className="appTitle">P</span>}
        </div>
      </div>

      <nav className="menu">
        {menuConfig
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <MenuLink
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={item.label}
              isOpen={isOpen}
            />
          ))}
      </nav>
    </div>
  );
};
export default Sidebar;