import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  // Some transitions (login -> redirect) may happen before React state updates.
  // Use localStorage as a fallback so redirect to protected routes doesn't fail
  // when the context hasn't updated yet.
  const isAuthenticatedFromStorage = !!localStorage.getItem("isAuthenticated");
  const effectiveAuthenticated = isAuthenticated || isAuthenticatedFromStorage;

  useEffect(() => {
    if (!effectiveAuthenticated) setLocation("/login");
  }, [effectiveAuthenticated, setLocation]);

  if (!effectiveAuthenticated) return null;

  return <>{children}</>;
}





