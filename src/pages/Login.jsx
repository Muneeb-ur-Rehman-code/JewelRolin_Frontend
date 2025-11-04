import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const success = await login(email, password);

    if (success) {
      const savedUser = JSON.parse(localStorage.getItem("muhi_user"));
      if (savedUser?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[var(--brand)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[var(--brand)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white rounded font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Not registered yet?{" "}
          <Link to="/register" className="text-[var(--brand)] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}