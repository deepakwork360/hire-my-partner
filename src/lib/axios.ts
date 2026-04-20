import axios from 'axios';
import { useAuthStore } from '../modules/auth/store';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://mypartneradmin.blackbullsolution.com/api',
  withCredentials: true, // Strictly needed to pass httpOnly cookies (like refreshToken)
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/refresh') {
      originalRequest._retry = true;
      try {
        // The backend uses the httpOnly cookie to authenticate this refresh call
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://mypartneradmin.blackbullsolution.com/api'}/refresh`, 
          {}, 
          { withCredentials: true }
        );
        
        const newToken = res.data.token || res.data.accessToken; 
        
        if (newToken) {
          useAuthStore.getState().setAccessToken(newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed -> forcibly clear auth and kick to login
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login'; 
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
