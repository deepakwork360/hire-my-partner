import axios from 'axios';
import { useAuthStore } from '../modules/auth/store';

const getCleanApiUrl = (): string => {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'https://mypartneradmin.blackbullsolution.com/api').trim();
  // Ensure relative URLs start with a leading slash to prevent relative resolution issues
  if (!url.startsWith('http') && !url.startsWith('/')) {
    url = '/' + url;
  }
  return url;
};

export const API_URL = getCleanApiUrl();

export const api = axios.create({
  baseURL: API_URL,
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
  (error) => Promise.reject(error)
);
