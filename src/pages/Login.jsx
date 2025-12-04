// src/pages/Login.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { users } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

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

  const handleLogin = () => {
    if (!email || !role) {
      alert("Please enter email and select role.");
      return;
    }

    let loggedUser = { email, role };

    // If employee is logging in, we try to find them in UserManagement data
    if (role === "user") {
      const existing = users.find((u) => u.email === email);

      if (!existing) {
        alert(
          "No employee found with this email. Please contact admin to create your account."
        );
        return;
      }

      loggedUser = {
        email: existing.email,
        role: existing.role || "user",
        id: existing.id,
        name: existing.name,
        active: existing.active,
      };
    }

    // Save to auth context + localStorage
    login(loggedUser);

    // Navigate to appropriate dashboard
    navigate(getHomePathForRole(loggedUser.role), { replace: true });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ minWidth: "360px" }}>
        <h3 className="mb-3 text-center">Attendance System Login</h3>
        <p className="text-muted text-center mb-4">
          Login as Admin, Receptionist or Employee
        </p>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="receptionist">Receptionist / Security</option>
            <option value="user">Employee / Member</option>
          </select>
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
