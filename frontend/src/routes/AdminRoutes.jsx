import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ManageBooks from "../pages/admin/ManageBooks";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageStaff from "../pages/admin/ManageStaff";
import ManageCategories from "../pages/admin/ManageCategories";

function RequireAdmin({ children }) {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");

  // ✅ Block anyone who is not an admin
  if (!token || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AdminRoutes() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="staff" element={<ManageStaff />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </RequireAdmin>
  );
}
