import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import VisitorManagement from "../pages/admin/VisitorManagement";
import ManualEntry from "../pages/receptionist/ManualEntry";
import MyAttendance from "../pages/user/MyAttendance";
import NotFound from "../pages/NotFound";
import Reports from "../pages/admin/Reports";

import { AuthContext } from "../context/AuthContext";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  // Protect routes
  const PrivateRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
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

        {/* Receptionist */}
        <Route
          path="/reception/manual-entry"
          element={
            <PrivateRoute role="receptionist">
              <ManualEntry />
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

        {/* User */}
        <Route
          path="/user/my-attendance"
          element={
            <PrivateRoute role="user">
              <MyAttendance />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
