import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { isTokenValid, clearAuth } from "../utils/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    isTokenValid()
  );

  useEffect(() => {
    if (!isTokenValid() && isAuthenticated) {
      clearAuth();
      setIsAuthenticated(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({ isAuthenticated, setIsAuthenticated }),
    [isAuthenticated, setIsAuthenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
