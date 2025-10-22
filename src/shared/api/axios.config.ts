import axios from "axios";
import { getAccessToken, clearAuthTokens } from "../lib/auth";

/**
 * Axios instance configuration
 * Configure base URL and default headers here
 *
 * In development: Uses Vite proxy (no baseURL needed)
 * In production: Set VITE_API_BASE_URL in .env
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - Add auth tokens, logging, etc.
 */
api.interceptors.request.use(
  (config) => {
    // Add auth token if available (uses memory cache for performance)
    const token = getAccessToken();
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
      clearAuthTokens();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);
