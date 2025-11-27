// src/pages/admin/Reports.jsx

import React, { useContext, useState, useMemo } from "react";
import { AttendanceContext } from "../../context/AttendanceContext";
import { UserContext } from "../../context/UserContext";
import AdminLayout from "../../layouts/AdminLayout";

const Reports = () => {
  const { logs } = useContext(AttendanceContext);
  const { users } = useContext(UserContext);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Merge log with user info
  const logsWithUserData = logs.map((log) => {
    const user = users.find((u) => u.id === log.userId);
    return {
      ...log,
      name: user?.name || "Unknown",
      role: user?.role || "N/A",
    };
  });

  // Filter by date
  const filteredByDate = useMemo(() => {
    if (!selectedDate) return logsWithUserData;
    const formatted = new Date(selectedDate).toLocaleDateString();
    return logsWithUserData.filter((log) => log.date === formatted);
  }, [selectedDate, logsWithUserData]);

  // Filter by month
  const finalFiltered = useMemo(() => {
    if (!selectedMonth) return filteredByDate;
    return filteredByDate.filter((log) => log.date.split("/")[1] === selectedMonth);
  }, [selectedMonth, filteredByDate]);

  // Export CSV
  const exportCSV = () => {
    let csv = "User ID,Name,Role,Date,Check-In,Check-Out\n";

    finalFiltered.forEach((log) => {
      csv += `${log.userId},${log.name},${log.role},${log.date},${log.checkIn},${log.checkOut}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2 className="fw-bold mb-3">Attendance Reports</h2>
        <p className="text-muted">Filter and export attendance logs.</p>

        {/* Filters */}
        <div className="card p-3 shadow-sm mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Filter by Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Filter by Month</label>
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">All Months</option>
                {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-success w-100" onClick={exportCSV}>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="card p-3 shadow-sm">
          <h5 className="mb-3">Filtered Records</h5>

          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Date</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {finalFiltered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-3 text-muted">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                finalFiltered.map((log) => (
                  <tr key={log.id}>
                    <td>{log.userId}</td>
                    <td>{log.name}</td>
                    <td>{log.role}</td>
                    <td>{log.date}</td>
                    <td>{log.checkIn}</td>
                    <td>{log.checkOut || "-"}</td>
                    <td>
                      {log.checkOut ? (
                        <span className="badge bg-success">Completed</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Inside</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
