import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, Role, User } from '../types';

const mockUsers = [
  { email: 'student@debterlink.com', password: 'student123', role: 'student' as Role, name: 'Dawit Mekonnen' },
  { email: 'teacher@debterlink.com', password: 'teacher123', role: 'teacher' as Role, name: 'Almaz Tadesse' },
  { email: 'parent@debterlink.com', password: 'parent123', role: 'parent' as Role, name: 'Kebede Haile' },
  { email: 'director@debterlink.com', password: 'director123', role: 'director' as Role, name: 'Meron Bekele' },
  { email: 'admin@debterlink.com', password: 'admin123', role: 'admin' as Role, name: 'Admin User' },
  { email: 'superadmin@debterlink.com', password: 'superadmin123', role: 'super_admin' as Role, name: 'Super Admin' },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        
        const user = mockUsers.find(u => u.email === trimmedEmail && u.password === trimmedPassword);
        
        if (user) {
          set({ 
            user: {
              id: '1',
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.role}`
            }, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          set({ isLoading: false });
          throw new Error('Invalid email or password');
        }
      },
      logout: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      updateUser: (updatedUser: User) => {
        set({ user: updatedUser });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
