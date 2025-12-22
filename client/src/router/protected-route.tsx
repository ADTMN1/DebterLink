import { useAuthStore } from '@/store/useAuthStore';
import { Redirect, Route, useLocation } from 'wouter';
import { ReactNode, useEffect } from 'react';
import { Role } from '@/types';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path?: string;
  children?: ReactNode;
  allowedRoles?: Role[];
}
export function ProtectedRoute({ component: Component, allowedRoles, ...rest }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [location, setLocation] = useLocation();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);
console.log(user.role);
  useEffect(() => {
    if (!isLoading && isAuthenticated && allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to dashboard if user doesn't have permission
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, user?.role, allowedRoles, setLocation]);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user?.role as Role)) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don&apos;t have permission to access this page.</p>
      </div>
    </div>;
  }

  return <Component {...rest} />;
}
