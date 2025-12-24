

import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const apiUrl = import.meta.env.VITE_API_URL || `http://localhost:2000/api`;

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get the latest storage data
const getAuthData = () => {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    const parsed = JSON.parse(authStorage);
    return parsed.state; // returns { user, access_token, refreshToken, ... }
  }
  return null;
};

// Helper to clear old tokens
const clearOldTokens = () => {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    const parsed = JSON.parse(authStorage);
    const state = parsed.state;
    
    // Clear tokens if they're causing JWT signature errors
    if (state.refreshToken) {
      console.warn("Clearing old refresh token to fix JWT signature issues");
      localStorage.removeItem("auth-storage");
      return null;
    }
  }
  return getAuthData();
};

// Force clear all tokens and redirect to login
export const forceFreshLogin = () => {
  console.warn("Forcing fresh login - clearing all auth tokens");
  localStorage.removeItem("auth-storage");
  window.location.replace("/login");
};

// Immediate token clearing function for JWT signature issues
const clearAllTokens = () => {
  console.warn("Clearing all auth tokens due to JWT signature mismatch");
  localStorage.removeItem("auth-storage");
  return null;
};

api.interceptors.request.use(
  (config) => {
    const data = getAuthData();
    console.log("=== REQUEST INTERCEPTOR DEBUG ===");
    console.log("Request URL:", config.url);
    console.log("Request method:", config.method);
    console.log("Auth data from localStorage:", data);
    console.log("User role:", data?.user?.role);
    console.log("Token exists:", !!data?.token);
    console.log("Refresh token exists:", !!data?.refreshToken);
    console.log("Request headers before:", config.headers);
    
    if (data?.token && config.headers) {
      config.headers.Authorization = `Bearer ${data.token}`;
      console.log("Authorization header set:", config.headers.Authorization);
    } else {
      console.warn("No token found or no headers available");
    }
    console.log("Final request headers:", config.headers);
    console.log("=== END REQUEST DEBUG ===");
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("=== RESPONSE INTERCEPTOR DEBUG ===");
    console.log("Response URL:", response.config.url);
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("=== END RESPONSE DEBUG ===");
    return response;
  },
  async (error) => {
    console.log("=== RESPONSE ERROR DEBUG ===");
    console.log("Error URL:", (error as any)?.config?.url);
    console.log("Error status:", (error as any)?.response?.status);
    console.log("Error message:", (error as any)?.message);
    console.log("Error response data:", (error as any)?.response?.data);
    console.log("Error headers:", (error as any)?.response?.headers);
    console.log("Request was retried:", (error as any)?.config?._retry);
    console.log("=== END RESPONSE ERROR DEBUG ===");
    
    const originalRequest = error.config;

    // Handle 401 and ensure we don't loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("=== 401 ERROR HANDLING ===");
      const errorMessage = (error as any)?.response?.data?.message;
      
      // If token verification failed, force fresh login
      if (errorMessage === 'Token verification failed - please login again') {
        console.log("Token verification failed, forcing fresh login");
        forceFreshLogin();
        return Promise.reject(error);
      }
      
      if (window.location.pathname.includes("/login")) {
        console.log("Already on login page, not retrying");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const data = clearOldTokens(); // This will clear old tokens
        if (!data?.refreshToken) {
          // Clear auth and redirect to login if no valid refresh token
          useAuthStore.getState().logout();
          window.location.replace("/login");
          return Promise.reject(error);
        }

        // Perform the refresh call
        const res = await axios.post(`${apiUrl}/auth/refresh`, {
          refreshToken: data.refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        if (!accessToken) {
          throw new Error("Refresh failed");
        }

        // Update the store
        useAuthStore.getState().setAuth(data.user, newRefreshToken, accessToken);

        // Update header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Logic Failed:", refreshError);
        
        // Clear all tokens and redirect on any refresh failure
        clearAllTokens();
        useAuthStore.getState().logout();
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);