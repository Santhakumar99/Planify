import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name,email, role, id, token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from sessionStorage
    let Email = sessionStorage.getItem("Email");
    let UserID = sessionStorage.getItem("UserID")
    let UserName = sessionStorage.getItem("UserName");
    let Role = sessionStorage.getItem("Role");
    let token = sessionStorage.getItem("token");
    console.log("🔁 [Auth Init] restoring from sessionStorage", {
      Email,
      UserID,
      UserName,
      Role,
      token,
    });

    if (UserName && Role && Email) {
      setUser({ name: UserName, email: Email, role: Role, id: UserID, token });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);
  // login should accept the values and set both sessionStorage (if needed) and context
  const login = ({ id, name,email, role, token }) => {
    // sessionStorage should already be set by LoginPage, but set defensively:
    if (id) sessionStorage.setItem("UserID", id);
    if (name) sessionStorage.setItem("UserName", name);
    if (email) sessionStorage.setItem("Email", email);
    if (role) sessionStorage.setItem("Role", role);
    if (token) sessionStorage.setItem("token", token);

    setUser({ id, name, email, role, token });
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;