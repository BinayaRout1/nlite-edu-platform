import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API from "../api";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  // 🚫 Stop auth check on login page
  if (location.pathname === "/admin/login") {
    return children;
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/admin/me");

        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
