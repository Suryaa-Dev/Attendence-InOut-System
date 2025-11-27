// src/pages/admin/UserManagement.jsx

import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import AdminLayout from "../../layouts/AdminLayout";

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    active: true,
  });

  const [editMode, setEditMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.id || !formData.name || !formData.role) {
      alert("Please fill all required fields");
      return;
    }

    if (editMode) {
      updateUser(formData.id, formData);
      setEditMode(false);
    } else {
      // Check duplicate ID
      if (users.some((u) => u.id === formData.id)) {
        alert("User ID already exists!");
        return;
      }

      addUser(formData);
    }

    setFormData({ id: "", name: "", email: "", role: "", active: true });
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setFormData(user);
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2 className="fw-bold mb-3">User Management</h2>
        <p className="text-muted">Add, edit, or remove users from the system.</p>

        {/* Form */}
        <div className="card shadow-sm p-3 mb-4">
          <h5>{editMode ? "Edit User" : "Add New User"}</h5>

          <form className="row g-3 mt-2" onSubmit={handleSubmit}>
            <div className="col-md-3">
              <label className="form-label fw-bold">User ID *</label>
              <input
                type="text"
                className="form-control"
                placeholder="EMP001"
                value={formData.id}
                disabled={editMode}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Name *</label>
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
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Role *</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="receptionist">Receptionist</option>
                <option value="user">Employee</option>
                <option value="visitor">Visitor</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Status</label>
              <select
                className="form-select"
                value={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.value === "true" })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100" type="submit">
                {editMode ? "Update" : "Add User"}
              </button>
            </div>

            {editMode && (
              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      id: "",
                      name: "",
                      email: "",
                      role: "",
                      active: true,
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* User Table */}
        <div className="card shadow-sm p-3">
          <h5 className="mb-3">All Users</h5>

          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email || "-"}</td>
                    <td>{u.role}</td>
                    <td>
                      {u.active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          if (confirm("Delete this user?")) deleteUser(u.id);
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

export default UserManagement;
