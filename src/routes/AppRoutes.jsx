// src/routes/AppRoutes.jsx
import React, { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import VisitorManagement from "../pages/admin/VisitorManagement";
import ManualEntry from "../pages/receptionist/ManualEntry";
import MyAttendance from "../pages/user/MyAttendance";
import NotFound from "../pages/NotFound";
import Reports from "../pages/admin/Reports";

import { AuthContext } from "../context/AuthContext";

const getHomePathForRole = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "receptionist":
      return "/reception/manual-entry";
    case "user":
      return "/me/attendance";
    default:
      return "/login";
  }
};

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required and doesn't match, send user to their own home
  if (role && user.role !== role) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route: if logged in, go to home based on role */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={getHomePathForRole(user.role)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={getHomePathForRole(user.role)} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="admin">
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/visitors"
          element={
            <PrivateRoute role="admin">
              <VisitorManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute role="admin">
              <Reports />
            </PrivateRoute>
          }
        />

        {/* Receptionist routes */}
        <Route
          path="/reception/manual-entry"
          element={
            <PrivateRoute role="receptionist">
              <ManualEntry />
            </PrivateRoute>
          }
        />

        {/* User routes */}
        <Route
          path="/me/attendance"
          element={
            <PrivateRoute role="user">
              <MyAttendance />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
