// src/pages/Login.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = () => {
    if (!email || !role) {
      alert("Please enter email and select a role");
      return;
    }

    login(email, role);

    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "receptionist") navigate("/reception/manual-entry");
    else navigate("/user/my-attendance");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-4">Attendance System Login</h3>

        <div className="mb-3">
          <label className="form-label fw-bold">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="john@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Select Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- choose role --</option>
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
