// src/layouts/ReceptionistLayout.jsx

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ReceptionistLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="navbar navbar-dark bg-primary px-3">
        <Link className="navbar-brand fw-bold" to="/reception/manual-entry">
          Security Desk
        </Link>

        <div className="d-flex align-items-center">
          <span className="text-white me-3">{user?.email}</span>
          <button className="btn btn-sm btn-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main content area */}
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
};

export default ReceptionistLayout;
