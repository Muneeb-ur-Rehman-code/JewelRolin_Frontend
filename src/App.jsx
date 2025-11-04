// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthContext } from "./context/AuthContext.jsx";

// User Pages
import Home from "./pages/Home.jsx";
import ProductPages from "./pages/ProductPages.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Success from "./pages/Success.jsx";
import OurStory from "./pages/OurStory.jsx";
import About from "./pages/About.jsx";

// Admin Pages (all lowercase folder)
import AddProduct from "./pages/admin/AddProduct.jsx";
import EditProduct from "./pages/admin/EditProduct.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Users from "./pages/admin/Users.jsx";
import UserDetail from "./pages/admin/UserDetail.jsx";

// Admin Layout (with Sidebar)
import AdminLayout from "./components/AdminLayout.jsx";

export default function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // check if current route is an admin route
  const isAdminPage = location.pathname.toLowerCase().startsWith("/admin");

  // check if current route is login or register
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // hide navbar/footer on admin, login, and register pages
  const hideLayout = isAdminPage || isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideLayout && <Navbar />}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductPages />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/success" element={<Success />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/about" element={<About />} />

              {/* Admin Routes (Protected + Sidebar Layout) */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="add" element={<AddProduct />} />
                <Route path="edit/:id" element={<EditProduct />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
                <Route path="users/:id" element={<UserDetail />} />
              </Route>

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <div className="max-w-4xl mx-auto p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">
                      404 — Page not found
                    </h2>
                    <p className="text-gray-600">
                      The page you're looking for doesn’t exist.
                    </p>
                  </div>
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}
