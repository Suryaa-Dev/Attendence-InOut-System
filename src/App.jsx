// src/App.jsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { VisitorProvider } from "./context/VisitorContext";
import "bootstrap/dist/css/bootstrap.min.css";

import "./styles/global.css"

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AttendanceProvider>
          <VisitorProvider>
            <AppRoutes />
          </VisitorProvider>
        </AttendanceProvider>
      </UserProvider>
    </AuthProvider>

  );
}

export default App;
