// src/pages/admin/Dashboard.jsx

import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { AttendanceContext } from "../../context/AttendanceContext";
import AdminLayout from "../../layouts/AdminLayout";
import AttendanceChart from "../../components/charts/AttendanceChart";

// import "./styles/global.css";

const AdminDashboard = () => {
  const { users } = useContext(UserContext);
  const { logs } = useContext(AttendanceContext);

  const today = new Date().toLocaleDateString();

  // Count today's check-ins
  const todaysEntries = useMemo(() => {
    return logs.filter((log) => log.date === today).length;
  }, [logs]);

  // Active users inside premises (checked in but not out)
  const activeUsers = useMemo(() => {
    return logs.filter((log) => log.date === today && log.checkOut === "").length;
  }, [logs]);

  // LAST 7 DAYS ATTENDANCE TREND
  const getLast7DaysData = () => {
    const labels = [];
    const values = [];
    const todayDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayDate);
      date.setDate(todayDate.getDate() - i);

      const formatted = date.toLocaleDateString(); // dd/mm/yyyy
      labels.push(formatted);

      const count = logs.filter((log) => log.date === formatted).length;
      values.push(count);
    }

    return { labels, values };
  };

  const trendData = getLast7DaysData();


  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2 className="fw-bold mb-3">Admin Dashboard</h2>
        <p className="text-muted">Overview of today's attendance and system activity.</p>

        {/* Stats Cards */}
        <div className="row g-4 mt-3">
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>Total Check-ins Today</h5>
              <h2 className="text-primary">{todaysEntries}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>Active Users Inside</h5>
              <h2 className="text-success">{activeUsers}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>Total Registered Users</h5>
              <h2 className="text-dark">{users.length}</h2>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="row g-4 mt-4">
          <div className="col-md-3">
            <Link to="/admin/users" className="text-decoration-none">
              <div className="card p-3 shadow-sm text-center bg-light dashboard-card">
                <h6>User Management</h6>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/admin/reports" className="text-decoration-none">
              <div className="card p-3 shadow-sm text-center bg-light dashboard-card">
                <h6>Attendance Reports</h6>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/admin/visitors" className="text-decoration-none">
              <div className="card p-3 shadow-sm text-center bg-light dashboard-card">
                <h6>Visitor Logs</h6>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/reception/manual-entry" className="text-decoration-none">
              <div className="card p-3 shadow-sm text-center bg-light dashboard-card">
                <h6>Manual Entry</h6>
              </div>
            </Link>
          </div>
        </div>

        {/* Placeholder Graph */}
        <div className="card shadow-sm p-4 mt-5">
            <h5 className="mb-3">Attendance Trend (Last 7 Days)</h5>
            <AttendanceChart data={trendData} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
