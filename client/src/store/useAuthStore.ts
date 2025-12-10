import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, Role, User } from '../types';

// Mock user data - in real app, this would come from backend API
const mockUsers: Record<string, { name: string; email: string; role: Role }> = {
  'student': { name: 'Abebe Kebede', email: 'student@debterlink.com', role: 'student' },
  'teacher': { name: 'Tigist Alemu', email: 'teacher@debterlink.com', role: 'teacher' },
  'parent': { name: 'Kebede Tesfaye', email: 'parent@debterlink.com', role: 'parent' },
  'director': { name: 'Dr. Yohannes', email: 'director@debterlink.com', role: 'director' },
  'admin': { name: 'Admin User', email: 'admin@debterlink.com', role: 'admin' },
  'superadmin': { name: 'Super Admin', email: 'superadmin@debterlink.com', role: 'super_admin' },
  'super_admin': { name: 'Super Admin', email: 'superadmin@debterlink.com', role: 'super_admin' },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        // Simulate API call - in real app, this would authenticate with backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authentication - check username and password
        // In real app, backend would return user data with role
        const userData = mockUsers[username.toLowerCase()];
        
        if (userData && password === '123456') { // Default password for demo
          set({ 
            user: {
              id: '1',
              name: userData.name,
              email: userData.email,
              role: userData.role,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.role}`
            }, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          set({ isLoading: false });
          throw new Error('Invalid username or password');
        }
      },
      logout: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
