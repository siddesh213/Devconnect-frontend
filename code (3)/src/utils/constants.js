// Get base URLs from environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://devconnect-bakend-live.onrender.com";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://devconnect-bakend-live.onrender.com";

export { BASE_URL, API_BASE_URL };
