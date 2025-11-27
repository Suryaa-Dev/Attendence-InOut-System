// src/context/AttendanceContext.jsx
import { createContext, useState } from "react";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [logs, setLogs] = useState(
    JSON.parse(localStorage.getItem("attendanceLogs")) || []
  );

  const checkIn = (userId) => {
    const newLog = {
      id: Date.now(),
      userId,
      date: new Date().toLocaleDateString(),
      checkIn: new Date().toLocaleTimeString(),
      checkOut: ""
    };

    const updated = [...logs, newLog];
    setLogs(updated);
    localStorage.setItem("attendanceLogs", JSON.stringify(updated));
  };

  const checkOut = (userId) => {
    const updated = logs.map((log) =>
      log.userId === userId && !log.checkOut
        ? { ...log, checkOut: new Date().toLocaleTimeString() }
        : log
    );

    setLogs(updated);
    localStorage.setItem("attendanceLogs", JSON.stringify(updated));
  };

  return (
    <AttendanceContext.Provider value={{ logs, checkIn, checkOut }}>
      {children}
    </AttendanceContext.Provider>
  );
};
