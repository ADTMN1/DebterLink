export type Role = 'student' | 'parent' | 'teacher' | 'director' | 'admin' | 'super_admin' ;


export interface User {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  avatar?: string;
}
export const isAdmin = (role: Role | undefined): boolean => {
  if (!role) return false;
  // This check covers both the string 'admin' and the number 1
  return role === 'admin' || role === 1;
};




export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  roles: Role[];
}
