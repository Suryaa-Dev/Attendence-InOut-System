// src/pages/admin/VisitorLogs.jsx

import React, { useContext, useState, useMemo } from "react";
import { VisitorContext } from "../../context/VisitorContext";
import AdminLayout from "../../layouts/AdminLayout";

const getISODateFromLocaleString = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const VisitorLogs = () => {
  const { visitors } = useContext(VisitorContext);

  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const enhancedVisitors = useMemo(
    () =>
      visitors.map((v) => {
        const dateISO = getISODateFromLocaleString(v.checkIn);
        let status = "Not Checked In";

        if (v.checkIn && !v.checkOut) status = "Inside";
        else if (v.checkIn && v.checkOut) status = "Checked Out";

        return {
          ...v,
          _dateISO: dateISO,
          _status: status,
        };
      }),
    [visitors]
  );

  const filteredVisitors = useMemo(() => {
    let result = [...enhancedVisitors];

    if (selectedDate) {
      result = result.filter((v) => v._dateISO === selectedDate);
    }

    if (statusFilter) {
      result = result.filter((v) => v._status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.id.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          v.contact.toLowerCase().includes(q) ||
          (v.purpose || "").toLowerCase().includes(q)
      );
    }

    // latest first by check-in time if possible
    result.sort((a, b) => {
      const da = new Date(a.checkIn || 0);
      const db = new Date(b.checkIn || 0);
      return db - da;
    });

    return result;
  }, [enhancedVisitors, selectedDate, statusFilter, search]);

  const handleClearFilters = () => {
    setSelectedDate("");
    setStatusFilter("");
    setSearch("");
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Visitor Logs</h3>
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
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="Inside">Inside</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Not Checked In">Not Checked In</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Search (ID / Name / Contact)</label>
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

        {/* Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Visitor History</h5>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Visitor ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No visitor records found.
                      </td>
                    </tr>
                  ) : (
                    filteredVisitors.map((v) => (
                      <tr key={v.id}>
                        <td>{v.id}</td>
                        <td>{v.name}</td>
                        <td>{v.contact}</td>
                        <td>{v.purpose}</td>
                        <td>{v._dateISO || "-"}</td>
                        <td>{v.checkIn || "-"}</td>
                        <td>{v.checkOut || "-"}</td>
                        <td>
                          {v._status === "Inside" && (
                            <span className="badge bg-success">Inside</span>
                          )}
                          {v._status === "Checked Out" && (
                            <span className="badge bg-secondary">
                              Checked Out
                            </span>
                          )}
                          {v._status === "Not Checked In" && (
                            <span className="badge bg-warning text-dark">
                              Not Checked In
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-muted small mt-2 mb-0">
              Total visitors: {visitors.length}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default VisitorLogs;
