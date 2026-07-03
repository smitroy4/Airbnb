import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { endpoints, getAccessToken, setAccessToken } from "./api";

export type Role = "GUEST" | "HOTEL_MANAGER" | "ADMIN" | string;

interface JwtPayload {
  sub?: string;
  email?: string;
  roles?: string | string[];
  exp?: number;
}

interface AuthState {
  token: string | null;
  email: string | null;
  roles: Role[];
  isAuthenticated: boolean;
  isManager: boolean;
  login: (email: string, password: string) => Promise<{ roles: Role[] }>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function parseRoles(raw: unknown): Role[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    // e.g. "[GUEST]" or "GUEST,HOTEL_MANAGER" or "GUEST"
    const cleaned = raw.replace(/^\[|\]$/g, "");
    return cleaned
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function decodeToken(token: string | null): { email: string | null; roles: Role[] } {
  if (!token) return { email: null, roles: [] };
  try {
    const p = jwtDecode<JwtPayload>(token);
    return { email: p.email ?? p.sub ?? null, roles: parseRoles(p.roles) };
  } catch {
    return { email: null, roles: [] };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [info, setInfo] = useState<{ email: string | null; roles: Role[] }>({ email: null, roles: [] });

  useEffect(() => {
    const existing = getAccessToken();
    if (existing) {
      setToken(existing);
      setInfo(decodeToken(existing));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await endpoints.login({ email, password });
    setAccessToken(res.accessToken);
    setToken(res.accessToken);
    const decoded = decodeToken(res.accessToken);
    setInfo(decoded);
    return { roles: decoded.roles };
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    await endpoints.signup({ email, password, name });
  }, []);

  const logout = useCallback(async () => {
    await endpoints.logout();
    setAccessToken(null);
    setToken(null);
    setInfo({ email: null, roles: [] });
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      token,
      email: info.email,
      roles: info.roles,
      isAuthenticated: !!token,
      isManager: info.roles.includes("HOTEL_MANAGER") || info.roles.includes("ADMIN"),
      login,
      signup,
      logout,
    }),
    [token, info, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
