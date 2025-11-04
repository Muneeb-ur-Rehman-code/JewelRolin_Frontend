// ...existing code...
import React, { createContext, useState, useEffect } from "react";
import api, { setAuthToken } from "../services/axiosConfig.js";

export const AuthContext = createContext();

const CURRENT_USER_KEY = "muhi_user";
const USERS_KEY = "muhi_users_v1";

// ...existing code...
function normalizeUser(raw) {
  if (!raw) return null;
  // handle string input
  const u = typeof raw === "string" ? JSON.parse(raw) : { ...raw };

  // pull token from possible places
  const token = u.token ?? u.accessToken ?? u.jwt ?? u._token ?? null;

  // ensure id is available as _id
  const idFromBody =
    u._id ?? u.id ?? u.userId ?? (u.user && (u.user._id ?? u.user.id)) ?? null;

  // build combined name safely and avoid mixing ?? with ||/&& in same expression
  const combined = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  const name = u.name ?? (combined || u.email || "");
  const email = u.email ?? (u.user ? u.user.email : "") ?? "";

  return {
    ...u,
    _id: idFromBody,
    id: idFromBody,
    token,
    name,
    email,
  };
}
// ...existing code...

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? normalizeUser(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  });

  // persist current user + ensure axios auth header is set
  useEffect(() => {
    try {
      if (user) {
        // store the normalized user (avoid circulars)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        if (user.token) setAuthToken(user.token);
        else setAuthToken(null);
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
        setAuthToken(null);
      }
    } catch (e) {}
  }, [user]);

  // ensure an admin exists in local fallback users (preserve prior behaviour)
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (!existing || existing.length === 0) {
        const admin = {
          name: "Admin",
          email: "admin@local",
          password: "admin123",
          phone: "",
          role: "admin",
        };
        localStorage.setItem(USERS_KEY, JSON.stringify([admin, ...existing]));
      }
    } catch (e) {}
  }, []);

  // Login using backend only (no localStorage fallback)
  const login = async (email, password) => {
    try {
      const payload = { email, password };
      const resp = await api.post("/api/users/signin", payload);
      if (resp && resp.data) {
        const serverUser = resp.data.user ?? resp.data;
        const token = resp.data.token ?? resp.data.accessToken ?? serverUser.token ?? null;
        const saved = normalizeUser({ ...serverUser, token });
        setUser(saved);

        // migrate guest cart if present and user's cart is empty (best-effort)
        try {
          const guestRaw = localStorage.getItem("muhi_cart_v1");
          const userKey = `muhi_cart_${encodeURIComponent(saved.email || saved.name || "user")}`;
          const userRaw = localStorage.getItem(userKey);
          if (guestRaw && (!userRaw || userRaw === "[]")) {
            localStorage.setItem(userKey, guestRaw);
            localStorage.removeItem("muhi_cart_v1");
          }
        } catch (e) {}

        return true;
      } else {
        return false;
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        alert(err.response.data.message);
      }
      return false;
    }
  };

  // Register using backend only (no localStorage fallback)
  const register = async (form) => {
    try {
      const name = `${form.firstName || ""} ${form.lastName || ""}`.trim();
      const payload = {
        name,
        email: form.email,
        phone: form.phone || "",
        password: form.password,
      };

      const resp = await api.post("/api/users/signup", payload);
      if (resp && resp.data) {
        const created = resp.data.user ?? resp.data;
        const token = resp.data.token ?? resp.data.accessToken ?? created.token ?? null;
        const saved = normalizeUser({ ...created, token });
        setUser(saved);
        return saved;
      } else {
        return null;
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        alert(err.response.data.message);
      }
      return null;
    }
  };

  // Get all users from backend (admin only)
  const getAllUsers = async () => {
    try {
      const resp = await api.get("/api/users/getAllUse");
      if (resp && resp.data && resp.data.users) {
        return resp.data.users;
      }
      return [];
    } catch (err) {
      console.error("Error fetching users:", err?.response?.data?.message || err.message);
      return [];
    }
  };
const logout = () => {
  setUser(null);
  setAuthToken(null);
  localStorage.removeItem(CURRENT_USER_KEY);
  navigate("/"); // 👈 Redirects user to homepage
};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// ...existing code...