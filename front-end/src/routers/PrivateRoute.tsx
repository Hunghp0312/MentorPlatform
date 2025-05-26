import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenValid, clearAuth } from "../utils/auth";
import { useAuthContext } from "../contexts/AuthContext";
import { pathName } from "../constants/pathName";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isTokenValid() || !isAuthenticated) {
    clearAuth();
    setIsAuthenticated(false);
    return <Navigate to={pathName.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
