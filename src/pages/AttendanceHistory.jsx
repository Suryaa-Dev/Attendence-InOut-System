import React, { useState } from "react";

const AttendanceHistory = () => {
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState([
    {
      id: 1,
      employeeId: "E001",
      name: "Rohit Sharma",
      department: "Production",
      status: "Check-In",
      timestamp: "2025-10-05 09:15 AM",
      guard: "Suresh Patil",
      gateId: "Gate-1",
    },
    {
      id: 2,
      employeeId: "E002",
      name: "Priya Nair",
      department: "Quality",
      status: "Check-Out",
      timestamp: "2025-10-05 05:30 PM",
      guard: "Suresh Patil",
      gateId: "Gate-1",
    },
    {
      id: 3,
      employeeId: "E003",
      name: "Anil Kumar",
      department: "Maintenance",
      status: "Check-In",
      timestamp: "2025-10-05 09:45 AM",
      guard: "Manoj Deshmukh",
      gateId: "Gate-2",
    },
  ]);


  const filtered = records.filter(
    (rec) =>
      rec.name.toLowerCase().includes(search.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      rec.department.toLowerCase().includes(search.toLowerCase())
  );


  const exportCSV = () => {
    const header = [
      "Employee ID",
      "Name",
      "Department",
      "Status",
      "Timestamp",
      "Guard",
      "Gate ID",
    ];
    const csvRows = [
      header.join(","),
      ...records.map((r) =>
        [
          r.employeeId,
          r.name,
          r.department,
          r.status,
          r.timestamp,
          r.guard,
          r.gateId,
        ].join(",")
      ),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "attendance_history.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          📜 Attendance History
        </h1>
        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, ID, or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 mb-6 px-4 py-2 border rounded-lg shadow-sm"
      />


      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Timestamp</th>
              <th className="p-3 text-left">Guard</th>
              <th className="p-3 text-left">Gate ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((rec) => (
                <tr key={rec.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{rec.employeeId}</td>
                  <td className="p-3">{rec.name}</td>
                  <td className="p-3">{rec.department}</td>
                  <td
                    className={`p-3 font-medium ${
                      rec.status === "Check-In"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {rec.status}
                  </td>
                  <td className="p-3">{rec.timestamp}</td>
                  <td className="p-3">{rec.guard}</td>
                  <td className="p-3">{rec.gateId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No records found 📭
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistory;
