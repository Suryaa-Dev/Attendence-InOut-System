// src/pages/receptionist/ManualEntry.jsx

import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { AttendanceContext } from "../../context/AttendanceContext";
import ReceptionistLayout from "../../layouts/ReceptionistLayout";

const ManualEntry = () => {
  const { users } = useContext(UserContext);
  const { logs, checkIn, checkOut } = useContext(AttendanceContext);

  const [search, setSearch] = useState("");

  const today = new Date().toLocaleDateString();

  // Filter users by ID or Name
  const filteredUsers = users.filter(
    (u) =>
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  // Get last log for a specific user
  const getUserStatus = (userId) => {
    const todayLogs = logs.filter(
      (log) => log.userId === userId && log.date === today
    );

    if (todayLogs.length === 0) return "outside";

    const lastLog = todayLogs[todayLogs.length - 1];
    return lastLog.checkOut === "" ? "inside" : "outside";
  };

  // Disable check-in if user already inside
  const canCheckIn = (userId) => getUserStatus(userId) === "outside";

  // Disable check-out if user is not inside
  const canCheckOut = (userId) => getUserStatus(userId) === "inside";

  return (
    <ReceptionistLayout>
      <div className="container mt-4">
        <h2 className="fw-bold mb-3">Manual Entry (Security Desk)</h2>
        <p className="text-muted">
          Search users and record check-in/check-out manually.
        </p>

        {/* Search Box */}
        <div className="card p-3 shadow-sm mb-4">
          <label className="form-label fw-bold">Search User</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter User ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Results Table */}
        <div className="card p-3 shadow-sm">
          <h5 className="mb-3">Users</h5>

          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const status = getUserStatus(u.id);

                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.role}</td>
                      <td>
                        {status === "inside" ? (
                          <span className="badge bg-success">Inside</span>
                        ) : (
                          <span className="badge bg-secondary">Outside</span>
                        )}
                      </td>

                      <td>
                        <button
                          disabled={!canCheckIn(u.id)}
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => checkIn(u.id)}
                        >
                          Check-In
                        </button>

                        <button
                          disabled={!canCheckOut(u.id)}
                          className="btn btn-sm btn-danger"
                          onClick={() => checkOut(u.id)}
                        >
                          Check-Out
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionistLayout>
  );
};

export default ManualEntry;
