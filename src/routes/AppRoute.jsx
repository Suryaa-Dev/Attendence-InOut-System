import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Visitors from "./pages/Visitors";
import AdminAddUser from "./pages/AdminAddUser";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/admin/add-user" element={<AdminAddUser />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
