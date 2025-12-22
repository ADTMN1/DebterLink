import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {  Role, User } from '../types';

const mockUsers = [
  { email: 'student@debterlink.com', password: 'student123', role: 'student' as Role, name: 'Dawit Mekonnen' },
  { email: 'teacher@debterlink.com', password: 'teacher123', role: 'teacher' as Role, name: 'Almaz Tadesse' },
  { email: 'parent@debterlink.com', password: 'parent123', role: 'parent' as Role, name: 'Kebede Haile' },
  { email: 'director@debterlink.com', password: 'director123', role: 'director' as Role, name: 'Meron Bekele' },
  { email: 'admin@debterlink.com', password: 'admin123', role: 'admin' as Role, name: 'Admin User' },
  { email: 'superadmin@debterlink.com', password: 'superadmin123', role: 'super_admin' as Role, name: 'Super Admin' },
];


interface AuthState {
  user: any | null;
  refreshToken: string | null;
  access_token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: any, refreshToken: string,access_token:string) => void;
  logout: () => void;
  updateUser: (updatedUser: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      refreshToken: null,
      access_token: null,
      isAuthenticated: false,

      // This matches your LoginPage: setAuth(res.data.data, res.data.refreshToken)
      setAuth: (user, refreshToken,access_token) => {
        set({ 
          user, 
          refreshToken,
          access_token, 
          isAuthenticated: true 
        });
      },

      logout: () => {
        set({ 
          user: null, 
          refreshToken: null, 
          isAuthenticated: false 
        });
        localStorage.removeItem('auth-storage'); // Explicit cleanup
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser
        }));
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);