import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

export type UserRole = 'teacher' | 'student' | 'parent' | 'director' | 'admin' | 'superAdmin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolCode?: string;
  avatar?: string;
  children?: Array<{ id: string; name: string }>;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  language: 'en' | 'am' | 'or';
  setLanguage: (lang: 'en' | 'am' | 'or') => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API simulation
const mockLoginAPI = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on email
  const users: Record<string, User> = {
    'teacher@school.com': {
      id: '1',
      email: 'teacher@school.com',
      name: 'John Teacher',
      role: 'teacher',
      schoolCode: 'SCH001',
      token: 'mock-jwt-token-123',
    },
    'student@school.com': {
      id: '2',
      email: 'student@school.com',
      name: 'Alice Student',
      role: 'student',
      schoolCode: 'SCH001',
      token: 'mock-jwt-token-456',
    },
    'parent@school.com': {
      id: '3',
      email: 'parent@school.com',
      name: 'Bob Parent',
      role: 'parent',
      schoolCode: 'SCH001',
      children: [
        { id: '1', name: 'Alice Student' },
        { id: '2', name: 'Tom Student' },
      ],
      token: 'mock-jwt-token-789',
    },
    'director@school.com': {
      id: '4',
      email: 'director@school.com',
      name: 'Sarah Director',
      role: 'director',
      schoolCode: 'SCH001',
      token: 'mock-jwt-token-abc',
    },
    'admin@school.com': {
      id: '5',
      email: 'admin@school.com',
      name: 'Mike Admin',
      role: 'admin',
      schoolCode: 'SCH001',
      token: 'mock-jwt-token-def',
    },
  };

  // Check if user exists
  if (users[email]) {
    // In real app, check password against hashed password in backend
    if (password === 'password123') { // Mock password check
      return users[email];
    } else {
      throw new Error('Invalid credentials');
    }
  } else {
    throw new Error('User not found');
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'en' | 'am' | 'or'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      // In a real app, you would make an API call here
      const userData = await mockLoginAPI(email, password);
      setUser(userData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear any stored tokens
      // await SecureStore.deleteItemAsync('userToken');
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        language,
        setLanguage,
        isAuthenticated: !!user,
        isLoading,
        error,
        clearError,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}