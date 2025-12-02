import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";

type User = { email: string; role: string; name?: string } | null;

interface AuthContextValue {
  user: User;
  isAuthenticated: boolean;
  login: (user: NonNullable<User>, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem("user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  const login = (u: NonNullable<User>, remember = false) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("isAuthenticated", "true");
    if (remember) localStorage.setItem("rememberMe", "true");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("rememberMe");
    // redirect to login
    setLocation("/login");
  };

  // Keep in sync with other tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "isAuthenticated") {
        const raw = localStorage.getItem("user");
        try {
          setUser(raw ? JSON.parse(raw) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
