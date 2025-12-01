import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'teacher' | 'student' | 'parent' | 'director' | 'admin' | 'superAdmin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  schoolCode?: string;
  avatar?: string;
  children?: Array<{ id: string; name: string }>;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, name: string, schoolCode: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  language: 'en' | 'am' | 'or';
  setLanguage: (lang: 'en' | 'am' | 'or') => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'en' | 'am' | 'or'>('en');

  const login = async (role: UserRole, name: string, schoolCode: string, password?: string) => {
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name,
      role,
      schoolCode,
    };

    if (role === 'parent') {
      newUser.children = [
        { id: '1', name: 'Abebe Kebede' },
        { id: '2', name: 'Tigist Kebede' },
      ];
    }

    setUser(newUser);
  };

  const logout = async () => {
    console.log('AuthContext logout called');
    try {
      // Clear user state immediately - this will trigger navigation change
      console.log('Setting user to null...');
      setUser(null);
      console.log('User set to null');
      // Small delay to ensure state propagates
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      language,
      setLanguage,
      isAuthenticated: !!user,
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
