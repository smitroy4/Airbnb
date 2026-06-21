import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "../utils/tokenUtils";

import { login as loginApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const response = await loginApi(credentials);

    setAccessToken(response.accessToken);

    const decoded = jwtDecode(response.accessToken);

    setUser({
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
    });

    return response;
  };

  const logout = () => {
    removeAccessToken();
    setUser(null);
  };

  useEffect(() => {
    try {
      const token = getAccessToken();

      if (token) {
        const decoded = jwtDecode(token);

        setUser({
          id: decoded.sub,
          email: decoded.email,
          roles: decoded.roles,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);

      removeAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);