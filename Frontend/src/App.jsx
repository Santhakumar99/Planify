// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import Users from "./Pages/Users/Users";
// // import ProjectMain from "./Pages/Projects/projectmain";
// // import Task from "./Pages/Tasks/Task";
// import Dashboard from "./Pages/Dashboard/Dashboardmain";
// import Sidebar from "./Pages/Sidebar/Sidebar";
// import Login from "./Pages/Login/Login";
// import ProtectedRoute from "./Auth/ProtectedRoute";
// import { AuthProvider } from "./Auth/Context";
// import ProtectedLayout from "./Auth/ProtectedLayout";
// import LoginPage from "./Pages/Login/Login";
// Navigate
// function App() {
//   return (
//     <div className="mainApp">
//     <AuthProvider>
//         <Router>
//           <Routes>
//             <Route path="/login" element={<LoginPage />} />
//             <Route element={<ProtectedLayout />}>
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={["user", "manager", "Admin"]}
//                   >
//                     <Dashboard />
//                   </ProtectedRoute>
//                 }
//               />
//               {/* <Route
//                 path="/users"
//                 element={
//                   <ProtectedRoute
//                    allowedRoles={["user", "manager", "Admin"]}
//                   >
//                     <Users />
//                   </ProtectedRoute>
//                 }
//               />
//                       <Route
//                path="/projects"
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={["user", "manager", "Admin"]}
//                   >
//                     <ProjectMain />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                path="/Tasks"
//                 element={
//                   <ProtectedRoute
//                    allowedRoles={["user", "manager", "Admin"]}
//                   >
//                     <Task />
//                   </ProtectedRoute>
//                 }
//               /> */}
//               <Route path="/" element={<Navigate to="/dashboard" replace />} />
//             </Route>
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//         </Router>
//     </AuthProvider>
//     </div>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import Users from "./Pages/Users/Users";
// import ProjectMain from "./Pages/Projects/projectmain";
// import Task from "./Pages/Tasks/Task";
import Dashboard from "./Pages/Dashboard/Dashboardmain";
import Sidebar from "./Pages/Sidebar/Sidebar";
import LoginPage from "./Pages/Login/Login";
import ProtectedRoute from "./Auth/ProtectedRoute";
import { AuthProvider } from "./Auth/Context";
import ProtectedLayout from "./Auth/ProtectedLayout";
import Projects from "./Pages/Projects/Projects";

function App() {
  return (
    <div className="mainApp">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["user", "manager", "Admin"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute allowedRoles={["user", "manager", "Admin"]}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute allowedRoles={["user", "manager", "Admin"]}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timelog"
                element={
                  <ProtectedRoute allowedRoles={["user", "manager", "Admin"]}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["user", "manager", "Admin"]}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["user", "manager", "Admin"]}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              {/* <Route path="/users" element={<ProtectedRoute ...><Users /></ProtectedRoute>} /> */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
