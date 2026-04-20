import { api } from '@/lib/axios';
import { User } from './types';

export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/user/me');
    return data;
  },
  getUserById: async (userId: string): Promise<User> => {
    const { data } = await api.get(`/user/${userId}`);
    return data;
  },
};
