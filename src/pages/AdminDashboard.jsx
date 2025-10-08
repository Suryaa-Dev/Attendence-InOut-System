import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const stats = [
    { title: "Total Users", value: 42 },
    { title: "Active Users", value: 35 },
    { title: "Inside Premises", value: 10 },
    { title: "Today’s Check-ins", value: 18 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8">
        Welcome, Admin 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-medium text-gray-600">{item.title}</h3>
            <p className="text-2xl font-semibold text-blue-600 mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>


      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activity Logs
        </h2>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                Employee ID
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                Name
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                Department
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                Status
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                Time
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                Gate ID
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-2">E001</td>
              <td className="border border-gray-200 px-4 py-2">Rohit Sharma</td>
              <td className="border border-gray-200 px-4 py-2">Production</td>
              <td className="border border-gray-200 px-4 py-2">Checked In</td>
              <td className="border border-gray-200 px-4 py-2">09:15 AM</td>
              <td className="border border-gray-200 px-4 py-2">Gate-1</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">E002</td>
              <td className="border border-gray-200 px-4 py-2">Priya Nair</td>
              <td className="border border-gray-200 px-4 py-2">Quality</td>
              <td className="border border-gray-200 px-4 py-2">Checked Out</td>
              <td className="border border-gray-200 px-4 py-2">05:30 PM</td>
              <td className="border border-gray-200 px-4 py-2">Gate-1</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">E003</td>
              <td className="border border-gray-200 px-4 py-2">Anil Kumar</td>
              <td className="border border-gray-200 px-4 py-2">Maintenance</td>
              <td className="border border-gray-200 px-4 py-2">Checked In</td>
              <td className="border border-gray-200 px-4 py-2">09:45 AM</td>
              <td className="border border-gray-200 px-4 py-2">Gate-2</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          ➕ Add New User
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
