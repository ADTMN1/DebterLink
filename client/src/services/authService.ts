import { apiClient } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout', {});
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/reset-password', { token, password });
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    return apiClient.get<AuthResponse['user']>('/auth/me');
  },
};
