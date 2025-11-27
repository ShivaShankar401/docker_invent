import axios from 'axios';

// Use relative base URL so React proxy forwards to the backend (set in package.json)
const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Do not redirect here; App routing will show Login when unauthenticated.
      // This avoids any accidental reload/redirect loops.
      console.warn('Unauthorized (401). Showing login page.');
    }
    return Promise.reject(error);
  }
);

export default api;
