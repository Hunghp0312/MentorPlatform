import { Navigate, useParams } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import { JSX } from "react";

interface RequireRoleProps {
  role?: string;
  roles?: string[];
  children: JSX.Element;
}

export const EditableUserProfileRoute = ({ children }: RequireRoleProps) => {
  const decodedToken = getUserFromToken();
  const { id } = useParams<{ id: string }>();
  if (!decodedToken) {
    return <Navigate to="/login" />;
  }
  if (decodedToken.role !== "Admin" && decodedToken.id !== id) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};
