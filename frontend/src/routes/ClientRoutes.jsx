import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";

// Client pages
import Home from "../pages/client/Home";
import Browse from "../pages/client/Browse";
import BookDetail from "../pages/client/BookDetail";
import Cart from "../pages/client/Cart";
import Checkout from "../pages/client/Checkout";
import About from "../pages/client/About";
import Contact from "../pages/client/Contact";

function RequireCustomer({ children }) {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");

  // If logged in as admin, redirect to admin dashboard
  if (token && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default function ClientRoutes() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/cart"
          element={
            <RequireCustomer>
              <Cart />
            </RequireCustomer>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireCustomer>
              <Checkout />
            </RequireCustomer>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ClientLayout>
  );
}
