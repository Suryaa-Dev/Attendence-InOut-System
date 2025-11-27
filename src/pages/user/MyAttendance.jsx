// src/pages/user/MyAttendance.jsx

import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AttendanceContext } from "../../context/AttendanceContext";

const MyAttendance = () => {
  const { user } = useContext(AuthContext);
  const { logs } = useContext(AttendanceContext);

  const [selectedMonth, setSelectedMonth] = useState("");

  // Filter logs that belong to logged-in user
  const myLogs = logs.filter((log) => log.userId === user.email || log.userId === user.id || log.userId === user.userId);

  // Convert "date/month/year" into JS comparable month (optional)
  const filterByMonth = (log) => {
    if (!selectedMonth) return true;

    const logMonth = log.date.split("/")[1]; // depends on locale: dd/mm/yyyy
    return logMonth === selectedMonth;
  };

  const filteredLogs = myLogs.filter(filterByMonth);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">My Attendance</h2>
      <p className="text-muted">View your daily attendance logs.</p>

      {/* Month Filter */}
      <div className="card p-3 shadow-sm mb-4">
        <label className="form-label fw-bold">Filter by Month</label>
        <select
          className="form-select w-50"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="card p-3 shadow-sm">
        <h5 className="mb-3">Attendance History</h5>

        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-3">
                  No attendance records available.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td>{log.checkIn || "-"}</td>
                  <td>{log.checkOut || "-"}</td>
                  <td>
                    {log.checkOut ? (
                      <span className="badge bg-success">Completed</span>
                    ) : (
                      <span className="badge bg-warning">Inside</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAttendance;
