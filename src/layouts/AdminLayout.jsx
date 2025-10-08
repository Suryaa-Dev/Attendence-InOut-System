import React, { useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
import { Link, Outlet} from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   alert("Logged out successfully!");
  //   navigate("/login");
  // };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-950 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h1
            className={`text-xl font-semibold ${
              !isOpen && "hidden"
            } md:block transition-all duration-300`}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-lg focus:outline-none"
          >
            {isOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          <Link
            to="/admin-dashboard"
            className="flex items-center space-x-3 hover:bg-blue-700 rounded-lg px-3 py-2 transition"
          >
            <span>🏠</span>
            {isOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/employee-check"
            className="flex items-center space-x-3 hover:bg-blue-700 rounded-lg px-3 py-2 transition"
          >
            <span>📋</span>
            {isOpen && <span>Check-in/Check-out</span>}
          </Link>

          <Link
            to="/add-user"
            className="flex items-center space-x-3 hover:bg-blue-700 rounded-lg px-3 py-2 transition"
          >
            <span>👥</span>
            {isOpen && <span>Add User</span>}
          </Link>

          <Link
            to="/attendance-history"
            className="flex items-center space-x-3 hover:bg-blue-700 rounded-lg px-3 py-2 transition"
          >
            <span>📋</span>
            {isOpen && <span>Attendance Logs</span>}
          </Link>

          <Link
            to="/reports"
            className="flex items-center space-x-3 hover:bg-blue-700 rounded-lg px-3 py-2 transition"
          >
            <span>📈</span>
            {isOpen && <span>Reports</span>}
          </Link>
        </nav>

        {/* <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-300 hover:text-white transition"
          >
            <span>🚪</span>
            {isOpen && <span>Logout</span>}
          </button>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
