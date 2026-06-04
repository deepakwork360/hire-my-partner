import { api } from '@/lib/axios';
import { User } from './types';

export const userRealApi = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/user/me');
    return data;
  },
  getUserById: async (userId: string): Promise<User> => {
    const { data } = await api.get(`/user/${userId}`);
    return data;
  },
};
