

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
  // console.log(authStorage);
  if (authStorage) {
    const parsed = JSON.parse(authStorage);
    return parsed.state; // returns { user, accessToken, refreshToken, ... }
  }
  return null;

};
//
api.interceptors.request.use(
  (config) => {
    const data = getAuthData();
    // console.log("Access  Token at at axios front", data.accessToken);
    // console.log("Refresh  Token at at axios front", data.refreshToken);
    if (data?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${data.accessToken}`;
      // console.log("token Sent ", config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 and ensure we don't loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (window.location.pathname.includes("/login")) {
localStorage.clear();
location.reload();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const data = getAuthData();
        if (!data?.refreshToken) throw new Error("No refresh token");

        // Perform the refresh call to your backend

        const res = await axios.post(`${apiUrl}/auth/refresh`,

           {
          refreshToken: data.refreshToken,
        });
                          console.log("Refreshed Token.", res);
 
        // Your backend returns: { accessToken, refreshToken, message }
        const { refreshToken, accessToken } = res.data;

        if (!accessToken) throw new Error("Refresh failed");

        // Update the store using the same 'user' we already have
        useAuthStore.getState().setAuth(data.user, refreshToken, accessToken);

        // Update header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Logic Failed:", refreshError);
      
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);