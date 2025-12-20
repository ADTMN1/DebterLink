import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);

export const api = axios.create({
  baseURL: apiUrl || `http://localhost:2000/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
