import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
{/*import Login from "./pages/Login";*/}
import AdminAddUser from "./pages/AdminAddUser";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AttendanceHistory from "./pages/AttendanceHistory";
import EmployeeCheckInOut from "./pages/EmployeeCheckInOut";
import GuardDashboard from "./pages/GuardDashboard";
import RouteDirectory from "./pages/RouteDirectory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RouteDirectory />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AdminLayout />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="add-user" element={<AdminAddUser />} />
          <Route path="attendance-history" element={<AttendanceHistory />} />
          <Route path="employee-check" element={<EmployeeCheckInOut />} />
          <Route path="guard-dashboard" element={<GuardDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
