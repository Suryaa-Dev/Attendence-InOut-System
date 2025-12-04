// src/pages/admin/Reports.jsx

import React, { useContext, useState, useMemo } from "react";
import { AttendanceContext } from "../../context/AttendanceContext";
import { UserContext } from "../../context/UserContext";
import AdminLayout from "../../layouts/AdminLayout";

const getMonthFromISO = (dateStr) => (dateStr ? dateStr.slice(0, 7) : "");

const diffHours = (startISO, endISO) => {
  if (!startISO || !endISO) return 0;
  const start = new Date(startISO);
  const end = new Date(endISO);
  const ms = end - start;
  if (isNaN(ms) || ms <= 0) return 0;
  return ms / (1000 * 60 * 60);
};

const formatTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value; // fallback for old/local strings
  return d.toLocaleTimeString();
};

const Reports = () => {
  const { logs } = useContext(AttendanceContext);
  const { users } = useContext(UserContext);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [search, setSearch] = useState("");

  // Merge log with user info
  const logsWithUserData = useMemo(
    () =>
      logs.map((log) => {
        const user =
          users.find((u) => u.id === log.userId) ||
          users.find((u) => u.email === log.userId);

        return {
          ...log,
          userName: user?.name || "Unknown",
          userEmail: user?.email || log.userId,
          userRole: user?.role || "-",
        };
      }),
    [logs, users]
  );

  const filteredLogs = useMemo(() => {
    let result = [...logsWithUserData];

    if (selectedDate) {
      result = result.filter((log) => log.date === selectedDate);
    }

    if (selectedMonth) {
      result = result.filter(
        (log) => getMonthFromISO(log.date) === selectedMonth
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.userName.toLowerCase().includes(q) ||
          log.userEmail.toLowerCase().includes(q) ||
          log.userRole.toLowerCase().includes(q)
      );
    }

    // Newest first
    result.sort((a, b) => {
      const da = new Date(a.checkIn || a.date);
      const db = new Date(b.checkIn || b.date);
      return db - da;
    });

    return result;
  }, [logsWithUserData, selectedDate, selectedMonth, search]);

  const summary = useMemo(() => {
    const totalRecords = filteredLogs.length;
    const uniqueUsers = new Set(filteredLogs.map((log) => log.userEmail)).size;
    const totalHours = filteredLogs.reduce(
      (sum, log) => sum + diffHours(log.checkIn, log.checkOut),
      0
    );

    return {
      totalRecords,
      uniqueUsers,
      totalHours: totalHours.toFixed(2),
    };
  }, [filteredLogs]);

  const handleClearFilters = () => {
    setSelectedDate("");
    setSelectedMonth("");
    setSearch("");
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Attendance Reports</h3>
        </div>

        {/* Filters */}
        <div className="card shadow-sm mb-4">
          <div className="card-body row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Filter by Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Filter by Month</label>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Search (Name / Email / Role)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-flex">
              <button
                className="btn btn-outline-secondary w-100 mt-4 mt-md-0"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Total Records</h6>
                <h3>{summary.totalRecords}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Unique Users</h6>
                <h3>{summary.uniqueUsers}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Total Hours</h6>
                <h3>{summary.totalHours} hrs</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Detailed Logs</h5>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Date</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No records found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const hours = diffHours(
                        log.checkIn,
                        log.checkOut
                      ).toFixed(2);

                      let statusLabel = "Inside";
                      let statusClass = "bg-warning text-dark";

                      if (!log.checkIn && !log.checkOut) {
                        statusLabel = "No Record";
                        statusClass = "bg-secondary";
                      } else if (log.checkIn && log.checkOut) {
                        statusLabel = "Completed";
                        statusClass = "bg-success";
                      }

                      return (
                        <tr key={log.id}>
                          <td>{log.userName}</td>
                          <td>{log.userEmail}</td>
                          <td className="text-capitalize">{log.userRole}</td>
                          <td>{log.date}</td>
                          <td>{formatTime(log.checkIn)}</td>
                          <td>{formatTime(log.checkOut)}</td>
                          <td>{hours}</td>
                          <td>
                            <span className={`badge ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
