// src/pages/receptionist/ManualEntry.jsx

import React, { useContext, useMemo, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { AttendanceContext } from "../../context/AttendanceContext";
import ReceptionistLayout from "../../layouts/ReceptionistLayout";

const getTodayISO = () => new Date().toISOString().slice(0, 10);

const ManualEntry = () => {
  const { users } = useContext(UserContext);
  const { logs, checkIn, checkOut } = useContext(AttendanceContext);

  const [search, setSearch] = useState("");

  const today = getTodayISO();

  // Filter users by ID, name or email
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.id?.toString().toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  // Get today's log for a given user
  const getTodayLogForUser = (userId) =>
    logs.find(
      (log) => log.userId === userId && log.date === today
    );

  const getStatusForUser = (userId) => {
    const log = getTodayLogForUser(userId);
    if (!log) return "Not Checked In";
    if (log.checkIn && !log.checkOut) return "Inside";
    if (log.checkIn && log.checkOut) return "Checked Out";
    return "Not Checked In";
  };

  const handleCheckIn = (userId) => {
    checkIn(userId);
  };

  const handleCheckOut = (userId) => {
    checkOut(userId);
  };

  return (
    <ReceptionistLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Manual Attendance Entry</h3>
          <span className="badge bg-primary fs-6">
            Today: {today}
          </span>
        </div>

        {/* Search box */}
        <div className="card shadow-sm mb-4">
          <div className="card-body d-flex flex-wrap gap-3 align-items-center">
            <div className="flex-grow-1">
              <label className="form-label fw-semibold">
                Search Employee (ID / Name / Email)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* User list + controls */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Employees</h5>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status (Today)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, index) => {
                      const status = getStatusForUser(u.id);
                      const log = getTodayLogForUser(u.id);

                      return (
                        <tr key={u.id || index}>
                          <td>{index + 1}</td>
                          <td>{u.id}</td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td className="text-capitalize">{u.role}</td>
                          <td>
                            {status === "Inside" && (
                              <span className="badge bg-success">
                                Inside
                              </span>
                            )}
                            {status === "Checked Out" && (
                              <span className="badge bg-secondary">
                                Checked Out
                              </span>
                            )}
                            {status === "Not Checked In" && (
                              <span className="badge bg-warning text-dark">
                                Not Checked In
                              </span>
                            )}

                            {log && (
                              <div className="small text-muted mt-1">
                                IN:{" "}
                                {log.checkIn &&
                                  new Date(
                                    log.checkIn
                                  ).toLocaleTimeString()}
                                {log.checkOut && (
                                  <>
                                    {" "}
                                    | OUT:{" "}
                                    {new Date(
                                      log.checkOut
                                    ).toLocaleTimeString()}
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-success"
                                disabled={status === "Inside"}
                                onClick={() => handleCheckIn(u.id)}
                              >
                                Check In
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                disabled={status !== "Inside"}
                                onClick={() => handleCheckOut(u.id)}
                              >
                                Check Out
                              </button>
                            </div>
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
    </ReceptionistLayout>
  );
};

export default ManualEntry;
