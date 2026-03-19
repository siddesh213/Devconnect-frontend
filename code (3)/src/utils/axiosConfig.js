import axios from "axios";
import { API_BASE_URL } from "./constants";

// ✅ Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_BASE_URL || "https://devconnect-bacckend-1ive-1.onrender.com",
  timeout: 10000,
  withCredentials: true, // Important for sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor - log requests in development
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`📥 Response:`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.warn("🔐 Unauthorized - Redirecting to login");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.warn("🚫 Forbidden - Access denied");
    }

    if (error.response?.status === 500) {
      console.error("🔴 Server error - Please contact support");
    }

    console.error(`Error (${error.response?.status}):`, error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;
