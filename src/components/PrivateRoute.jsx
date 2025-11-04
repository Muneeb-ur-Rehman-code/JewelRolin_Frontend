// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Usage:
 * <PrivateRoute> ... </PrivateRoute>               // any logged-in user
 * <PrivateRoute roles={['admin']}> ... </PrivateRoute> // only admin
 */
export default function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // not logged in -> send to login and remember origin
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const allowed = roles.map((r) => r.toLowerCase());
    if (!allowed.includes((user.role || "").toLowerCase())) {
      // logged in but unauthorized
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
