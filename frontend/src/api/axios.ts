import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, ApiError } from '@/types';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config
      );
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }
    return response;
  },
  (error: AxiosError<ApiError>): Promise<AxiosError<ApiError>> => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.error(
        '[API Response Error]',
        error.response?.data || error.message
      );
    }

    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear auth
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
