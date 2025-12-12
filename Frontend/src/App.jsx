import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboardmain";
import Sidebar from "./Pages/Sidebar/Sidebar";
import LoginPage from "./Pages/Login/Login";
import ProtectedRoute from "./Auth/ProtectedRoute";
import { AuthProvider } from "./Auth/Context";
import ProtectedLayout from "./Auth/ProtectedLayout";
import Projects from "./Pages/Projects/Projects";
import RegistrationPage from "./Pages/Login/registration";
import Registration from "./Pages/Login/registration";
import ProjectOverview from "./Pages/Projects/ProjectViews";
import TasksDashboard from "./Pages/Tasks/TaskDashboard";
import UsersPage from "./Pages/Users/UserPage";

function App() {
  return (
    <div className="mainApp">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Registration />} />
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
                path="/projects/:id"
                element={
                  <ProtectedRoute allowedRoles={["user", "manager", "Admin"]}>
                    <ProjectOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute allowedRoles={["employee", "manager", "Admin"]}>
                    <TasksDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timelog"
                element={
                  <ProtectedRoute allowedRoles={["employee", "manager", "Admin"]}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["employee", "manager", "Admin"]}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["employee", "manager", "Admin"]}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              {/* <Route path="/users" element={<ProtectedRoute ...><Users /></ProtectedRoute>} /> */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<Navigate to="/register" replace />} />
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
