import axios from "axios";

/**
 * Axios instance configuration
 * Configure base URL and default headers here
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - Add auth tokens, logging, etc.
 */
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);
