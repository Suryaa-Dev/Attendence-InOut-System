import React, { useState } from "react";

const GuardDashboard = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([
    {
      id: "E001",
      name: "Rohit Sharma",
      department: "Production",
      checkedIn: false,
      lastUpdated: null,
    },
    {
      id: "E002",
      name: "Priya Nair",
      department: "Quality",
      checkedIn: true,
      lastUpdated: "2025-10-05 09:15 AM",
    },
    {
      id: "E003",
      name: "Anil Kumar",
      department: "Maintenance",
      checkedIn: false,
      lastUpdated: null,
    },
  ]);

  // ✅ Filter based on search bar
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Check-In / Check-Out Handler
  const handleToggle = (id) => {
    const updated = employees.map((emp) => {
      if (emp.id === id) {
        const newStatus = !emp.checkedIn;
        return {
          ...emp,
          checkedIn: newStatus,
          lastUpdated: new Date().toLocaleString(),
        };
      }
      return emp;
    });
    setEmployees(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Security-Guard Dashboard
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name, ID or department ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="p-3 text-left">Emp ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Last Updated</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b hover:bg-gray-100 transition-all"
                >
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3">
                    {emp.checkedIn ? (
                      <span className="text-green-600 font-medium">Checked In</span>
                    ) : (
                      <span className="text-red-500 font-medium">Checked Out</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-500">
                    {emp.lastUpdated || "—"}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggle(emp.id)}
                      className={`px-4 py-1 rounded-lg text-white font-medium ${
                        emp.checkedIn
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {emp.checkedIn ? "Check Out" : "Check In"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No employees found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuardDashboard;
