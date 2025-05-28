import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import { JSX } from "react";

interface RequireRoleProps {
  role?: string;
  roles?: string[];
  children: JSX.Element;
}

export const RequireRole = ({ role, children, roles }: RequireRoleProps) => {
  const decodedToken = getUserFromToken();

  if (!decodedToken) {
    return <Navigate to="/login" />;
  }

  if (role && decodedToken.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  if (roles && roles.length > 0 && !roles.includes(decodedToken.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
