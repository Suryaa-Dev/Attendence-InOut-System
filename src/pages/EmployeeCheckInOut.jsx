import React, { useState } from "react";

const EmployeeCheckInOut = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([
    { id: 1, name: "Ravi Sharma", department: "IT", status: "Checked Out" },
    { id: 2, name: "Priya Verma", department: "HR", status: "Inside" },
    { id: 3, name: "Amit Singh", department: "Security", status: "Checked Out" },
    { id: 4, name: "Kiran Patil", department: "Accounts", status: "Checked Out" },
  ]);

  const handleCheckInOut = (id) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: emp.status === "Inside" ? "Checked Out" : "Inside",
            }
          : emp
      )
    );
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow rounded-lg p-5 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Employee Check-In/Out</h1>
      </header>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search employee by name..."
          className="w-full border p-2 rounded-md mr-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{emp.name}</td>
                  <td className="border p-2">{emp.department}</td>
                  <td
                    className={`border p-2 font-medium ${
                      emp.status === "Inside" ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {emp.status}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleCheckInOut(emp.id)}
                      className={`px-4 py-1 rounded-lg text-white ${
                        emp.status === "Inside"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {emp.status === "Inside" ? "Check Out" : "Check In"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500 text-center">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeCheckInOut;
