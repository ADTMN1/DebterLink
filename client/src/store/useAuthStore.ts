import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {  Role, User } from '../types';
import { safeLocalStorage } from '../lib/safe-storage';

// Mock users for development - REMOVE IN PRODUCTION
const mockUsers = [];
//       isLoading: false,
//       login: async (email: string, password: string) => {
//         set({ isLoading: true });
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         const trimmedEmail = email.trim();
//         const trimmedPassword = password.trim();
        
//         const user = mockUsers.find(u => u.email === trimmedEmail && u.password === trimmedPassword);
        
//         if (user) {
//           set({ 
//             user: {
//               id: '1',
//               name: user.name,
//               email: user.email,
//               role: user.role,
//               avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.role}`
//             }, 
//             isAuthenticated: true, 
//             isLoading: false 
//           });
//         } else {
//           set({ isLoading: false });
//           throw new Error('Invalid email or password');
//         }
//       },
//       logout: async () => {
//         set({ isLoading: true });
//         await new Promise(resolve => setTimeout(resolve, 500));
//         set({ user: null, isAuthenticated: false, isLoading: false });
//       },
//       updateUser: (updatedUser: User) => {
//         set({ user: updatedUser });
//       },
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// );

interface AuthState {
  user: any | null;
  refreshToken: string | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: any, refreshToken: string, accessToken: string) => void;
  logout: () => void;
  updateUser: (updatedUser: any) => void;
  validateToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      refreshToken: null,
      token: null,
      isAuthenticated: false,

      // Validate current token on store initialization
      validateToken: async () => {
        const state = get();
        if (state.token && state.isAuthenticated) {
          try {
            // First check if token is expired by decoding JWT
            const tokenParts = state.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              
              if (payload.exp && payload.exp < currentTime) {
                // Token expired, clear auth
                set({ isAuthenticated: false, user: null, token: null });
                return false;
              }
            }
            
            // Test the token with the profile endpoint
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2000/api'}/profile`, {
              headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              // Token is invalid, logout
              get().logout();
            }
          } catch (error) {
            get().logout();
          }
        }
      },

      logout: () => {
        // Clear all auth data from store
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false
        });
        
        // Clear all browser storage using safeLocalStorage
        safeLocalStorage.removeItem('auth-storage');
        sessionStorage.clear();
        localStorage.clear(); // Force clear all localStorage
      },

      // This matches your LoginPage: setAuth(res.data.data, res.data.refreshToken)
      setAuth: (user, refreshToken, accessToken) => {
        set({
          user,
          refreshToken,
          token: accessToken,
          isAuthenticated: true,
        });
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const value = safeLocalStorage.getItem(name);
          if (!value) return null;
          try {
            return JSON.parse(value);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          safeLocalStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => safeLocalStorage.removeItem(name),
      },
    }
  )
);