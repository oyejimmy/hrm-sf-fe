import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/selectors/authSelectors";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  // 🔒 Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔑 Wrong role → redirect to correct dashboard
  if (user && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "admin":
      case "hr":
        return <Navigate to="/admin/dashboard" replace />;
      case "team_lead":
        return <Navigate to="/team-lead/dashboard" replace />;
      case "employee":
        return <Navigate to="/employee/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // ✅ Access granted
  return <>{children}</>;
};
