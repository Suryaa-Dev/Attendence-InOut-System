import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminAddUser from "./pages/AdminAddUser";


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/" element={<AdminAddUser />} />

      </Routes>
    </Router>
  );
}

export default App;
