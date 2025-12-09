export type Role = 'student' | 'parent' | 'teacher' | 'director' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: Role[];
}
