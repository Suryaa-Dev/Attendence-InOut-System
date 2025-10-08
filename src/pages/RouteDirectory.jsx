import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RouteDirectory = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // check on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const routes = [
    { name: "Login Page", path: "/login" },
    { name: "Admin Dashboard", path: "/admin-dashboard" },
    { name: "Add New User (Admin)", path: "/employee-check" },
    { name: "Security-Guard Dashboard", path: "/guard-dashboard" },
    { name: "Attendance History", path: "/attendance-history" },
    { name: "Add New User (Admin)", path: "/add-user" },
  ];

  // 📱 Show mobile warning if accessed on small device
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100 px-6 text-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Desktop View Recommended
          </h2>
          <p className="text-gray-600">
            This site is currently optimized for desktop or laptop devices.{" "}
            <br /> Please switch to a larger screen for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-700 mb-4 text-center">
          ⚙️ Access Control System - Route Directory
        </h1>
        <p className="text-gray-900 text-center mb-6">
          Explore the list of active routes to preview and test different UI modules under development.
        </p>

        <div className="space-y-4">
          {routes.map((route, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <span className="text-gray-700 font-medium">{route.name}</span>
              <Link
                to={route.path}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Visit
              </Link>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default RouteDirectory;
