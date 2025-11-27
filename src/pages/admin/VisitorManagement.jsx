// src/pages/admin/VisitorManagement.jsx

import React, { useState, useContext } from "react";
import { VisitorContext } from "../../context/VisitorContext";
import AdminLayout from "../../layouts/AdminLayout";

const VisitorManagement = () => {
    const { visitors, addVisitor, checkoutVisitor, deleteVisitor } =
        useContext(VisitorContext);

    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        purpose: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.purpose) {
            alert("Name and Purpose are required!");
            return;
        }

        addVisitor(formData);
        setFormData({ name: "", contact: "", purpose: "" });
    };

    return (
        <AdminLayout>
            <div className="container mt-4">
                <h2 className="fw-bold mb-3">Visitor Management</h2>
                <p className="text-muted">Register visitors and track entry/exit.</p>

                {/* Add Visitor */}
                <div className="card p-3 shadow-sm mb-4">
                    <h5>Add Visitor</h5>

                    <form className="row g-3 mt-1" onSubmit={handleSubmit}>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Visitor Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Contact</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="9876543210"
                                value={formData.contact}
                                onChange={(e) =>
                                    setFormData({ ...formData, contact: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold">Purpose *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Meeting / Delivery / Service..."
                                value={formData.purpose}
                                onChange={(e) =>
                                    setFormData({ ...formData, purpose: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-primary w-100" type="submit">
                                Add
                            </button>
                        </div>
                    </form>
                </div>

                {/* Visitors Table */}
                <div className="card p-3 shadow-sm">
                    <h5 className="mb-3">Visitor Logs</h5>

                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Visitor ID</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Purpose</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th style={{ width: "180px" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {visitors.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted py-3">
                                        No visitors found.
                                    </td>
                                </tr>
                            ) : (
                                visitors.map((v) => (
                                    <tr key={v.id}>
                                        <td>{v.id}</td>
                                        <td>{v.name}</td>
                                        <td>{v.contact || "-"}</td>
                                        <td>{v.purpose}</td>
                                        <td>{v.checkIn}</td>
                                        <td>{v.checkOut || "-"}</td>

                                        <td>
                                            {!v.checkOut && (
                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    onClick={() => checkoutVisitor(v.id)}
                                                >
                                                    Check-Out
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    if (confirm("Delete this visitor?"))
                                                        deleteVisitor(v.id);
                                                }}
                                            >
                                                Delete
                                            </button>
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

export default VisitorManagement;
