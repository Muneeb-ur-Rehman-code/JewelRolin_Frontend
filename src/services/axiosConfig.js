// src/services/axiosConfig.js
import axios from "axios";

const API_BASE = "http://localhost:5000";

// Create axios instance WITHOUT forcing global Content-Type JSON
const api = axios.create({
  baseURL: API_BASE,
});

// helper: set auth token for subsequent requests
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Try to auto-load token from localStorage on init (supports different storage keys)
(function initAuthFromStorage() {
  try {
    const raw = localStorage.getItem("muhi_user") || localStorage.getItem("user") || localStorage.getItem("token");
    if (!raw) return;
    // if object stored as JSON like { token: "...", user: {...} }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw; // plain string token
    }
    const token = parsed?.token || parsed?.accessToken || (typeof parsed === "string" ? parsed : null);
    if (token) setAuthToken(token);
  } catch (e) {
    // ignore storage read errors in restricted environments
    // eslint-disable-next-line no-console
    console.warn("[api] unable to load token from localStorage", e);
  }
})();

// request logging for debug (remove in production)
api.interceptors.request.use((cfg) => {
  // eslint-disable-next-line no-console
  console.debug("[api] request:", cfg.method?.toUpperCase(), cfg.url, cfg.headers?.Authorization ? "AUTH" : "NO-AUTH");
  return cfg;
});

// response/error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // make error logging clearer and consistent
    const status = err.response?.status;
    const data = err.response?.data;
    // eslint-disable-next-line no-console
    console.error("[api] response error:", status, data || err.message);

    // Attach normalized message to error for easier UI consumption
    if (data && typeof data === "object" && data.message) {
      err.normalizedMessage = data.message;
    } else if (typeof data === "string") {
      err.normalizedMessage = data;
    } else {
      err.normalizedMessage = err.message || "Unknown API error";
    }

    return Promise.reject(err);
  }
);

export default api;
