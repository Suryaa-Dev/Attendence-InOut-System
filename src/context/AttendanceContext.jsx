// src/context/AttendanceContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";

export const AttendanceContext = createContext();

const STORAGE_KEY = "attendanceLogs";

const getTodayISO = () => new Date().toISOString().slice(0, 10);

const getInitialLogs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const AttendanceProvider = ({ children }) => {
  const [logs, setLogs] = useState(getInitialLogs);

  // Sync to localStorage whenever logs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  // Create a new check-in if user is not already checked in today
  const checkIn = useCallback((userId) => {
    const today = getTodayISO();
    const now = new Date().toISOString();

    setLogs((prev) => {
      const hasOpen = prev.some(
        (log) =>
          log.userId === userId &&
          log.date === today &&
          !log.checkOut
      );

      if (hasOpen) {
        // already checked in & not checked out → ignore
        return prev;
      }

      const newLog = {
        id: Date.now(),
        userId,
        date: today,
        checkIn: now,
        checkOut: null,
      };

      return [...prev, newLog];
    });
  }, []);

  // Close the latest open log for today, if any
  const checkOut = useCallback((userId) => {
    const today = getTodayISO();
    const now = new Date().toISOString();

    setLogs((prev) => {
      let updated = false;

      const next = prev.map((log) => {
        if (
          !updated &&
          log.userId === userId &&
          log.date === today &&
          !log.checkOut
        ) {
          updated = true;
          return { ...log, checkOut: now };
        }
        return log;
      });

      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <AttendanceContext.Provider value={{ logs, checkIn, checkOut, clearAll }}>
      {children}
    </AttendanceContext.Provider>
  );
};
