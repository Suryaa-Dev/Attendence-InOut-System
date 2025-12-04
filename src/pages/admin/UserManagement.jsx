// src/pages/admin/UserManagement.jsx

import React, { useContext, useState, useMemo } from "react";
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
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      role: "",
      active: true,
    });
    setEditMode(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.id || !formData.name || !formData.email || !formData.role) {
      alert("Please fill all required fields (ID, Name, Email, Role).");
      return;
    }

    if (editMode && editingId) {
      updateUser(editingId, formData);
      resetForm();
      return;
    }

    // Add mode: check duplicate ID
    const idExists = users.some((u) => u.id === formData.id);
    if (idExists) {
      alert("A user with this ID already exists.");
      return;
    }

    addUser(formData);
    resetForm();
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active ?? true,
    });
    setEditMode(true);
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.id.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>User Management</h3>
        </div>

        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">
                  {editMode ? "Edit User" : "Add New User"}
                </h5>

                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-12">
                    <label className="form-label">User ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="E.g. EMP001"
                      disabled={editMode}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Employee name"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Role *</label>
                    <select
                      className="form-select text-capitalize"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="receptionist">Receptionist / Security</option>
                      <option value="user">Employee / Member</option>
                    </select>
                  </div>

                  <div className="col-12 form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="activeCheck"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label ms-1"
                      htmlFor="activeCheck"
                    >
                      Active
                    </label>
                  </div>

                  <div className="col-12 d-flex gap-2 mt-2">
                    <button type="submit" className="btn btn-primary">
                      {editMode ? "Update User" : "Add User"}
                    </button>
                    {editMode && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">All Users</h5>
                  <div style={{ maxWidth: "260px" }} className="w-100">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th style={{ width: "140px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center text-muted">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td className="text-capitalize">{u.role}</td>
                            <td>
                              {u.active ? (
                                <span className="badge bg-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary">
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleEdit(u)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(u.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="text-muted small mt-2 mb-0">
                  Total users: {users.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
