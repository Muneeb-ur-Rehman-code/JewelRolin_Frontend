import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

// ...existing code...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      setError("Invalid email format!");
      return;
    }
    if (form.phone && !/^[0-9]{10,15}$/.test(form.phone)) {
      setError("Phone must be 10–15 digits only!");
      return;
    }

    // ✅ call context register (will create an empty per-user cart)
    const result = await register(form);
    if (result) {
      // redirect after register only if successful
      navigate("/login");
    } else {
      setError("Registration failed. Please check your details or try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-[var(--brand)]"
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-[var(--brand)]"
            />
          </div>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[var(--brand)]"
          />

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (Optional)"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[var(--brand)]"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[var(--brand)]"
          />

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            minLength={6}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[var(--brand)]"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white rounded font-semibold hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--brand)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
