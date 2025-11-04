import React, { useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // clears token and user from context
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[var(--accent)]/10 via-white to-[var(--brand)]/10">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white shadow-xl p-6 space-y-6 transition-transform duration-200 ease-in-out z-50
        md:translate-x-0`}
      >
        {/* Sticky heading */}
        <h2 className="top-0 bg-white text-2xl font-extrabold rounded-lg shadow text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text hover:opacity-90 transition p-2 text-center z-10">
          ⚡ Admin Panel
        </h2>

        <nav className="space-y-3 mt-4">
          <Link
            to="/admin/dashboard"
            className="block px-3 py-2 rounded-md hover:bg-[var(--brand)]/10 transition font-medium"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/add"
            className="block px-3 py-2 rounded-md hover:bg-[var(--brand)]/10 transition font-medium"
            onClick={() => setOpen(false)}
          >
            Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="block px-3 py-2 rounded-md hover:bg-[var(--brand)]/10 transition font-medium"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>
          <Link
            to="/admin/users"
            className="block px-3 py-2 rounded-md hover:bg-[var(--brand)]/10 transition font-medium"
            onClick={() => setOpen(false)}
          >
            Users
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90 transition font-medium"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar (mobile only) */}
        <div className="md:hidden flex items-center justify-between bg-white shadow p-4">
          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-2 border rounded"
          >
            ☰
          </button>
          <h1 className="font-bold text-lg text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text">
            Admin Panel
          </h1>
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
