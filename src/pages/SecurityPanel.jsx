import React, { useState } from "react";

const SecurityPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([
    { id: 1, name: "Ravi Sharma", department: "IT", status: "Checked Out" },
    { id: 2, name: "Priya Verma", department: "HR", status: "Inside" },
    { id: 3, name: "Amit Singh", department: "Security", status: "Checked Out" },
    { id: 4, name: "Kiran Patil", department: "Accounts", status: "Checked Out" },
  ]);

  const [visitors, setVisitors] = useState([
    { id: 1, name: "Sanjay Patil", purpose: "Meeting", status: "Inside" },
    { id: 2, name: "Neha Joshi", purpose: "Delivery", status: "Checked Out" },
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

  const handleVisitorStatus = (id) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: v.status === "Inside" ? "Checked Out" : "Inside",
            }
          : v
      )
    );
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-white shadow rounded-lg p-5 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Security Control Panel</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 bg-white shadow rounded-lg p-3">
        {["overview", "employees", "visitors", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === "overview" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Today's Summary</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 bg-blue-100 rounded-lg text-center shadow">
                <p className="text-lg text-gray-700">Total Employees</p>
                <p className="text-2xl font-semibold">{employees.length}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg text-center shadow">
                <p className="text-lg text-gray-700">Inside Premises</p>
                <p className="text-2xl font-semibold">
                  {employees.filter((e) => e.status === "Inside").length +
                    visitors.filter((v) => v.status === "Inside").length}
                </p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg text-center shadow">
                <p className="text-lg text-gray-700">Visitors Today</p>
                <p className="text-2xl font-semibold">{visitors.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Employee Check-In/Out</h2>
            <input
              type="text"
              placeholder="Search employee..."
              className="w-full border p-2 rounded-md mb-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                          emp.status === "Inside"
                            ? "text-green-600"
                            : "text-gray-600"
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
                    <td
                      colSpan="4"
                      className="p-4 text-gray-500 text-center"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "visitors" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Visitor Management</h2>
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Purpose</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr key={v.id} className="text-center hover:bg-gray-50">
                    <td className="border p-2">{v.name}</td>
                    <td className="border p-2">{v.purpose}</td>
                    <td
                      className={`border p-2 font-medium ${
                        v.status === "Inside" ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {v.status}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleVisitorStatus(v.id)}
                        className={`px-4 py-1 rounded-lg text-white ${
                          v.status === "Inside"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {v.status === "Inside" ? "Check Out" : "Check In"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Access History</h2>
            <p className="text-gray-500 italic">In Progress...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPanel;
