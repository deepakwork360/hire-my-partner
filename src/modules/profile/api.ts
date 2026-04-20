import { api } from '@/lib/axios';
import { Profile, UpdateProfilePayload } from './types';

export const profileApi = {
  getMyProfile: async (): Promise<Profile> => {
    const { data } = await api.get('/profile/me');
    return data;
  },
  updateProfile: async (data: UpdateProfilePayload): Promise<Profile> => {
    const { data: responseData } = await api.patch('/profile/update', data);
    return responseData;
  },
  uploadPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await api.post('/profile/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.photoUrl; // Assuming backend returns { photoUrl: '...' }
  },
  deletePhoto: async (photoId: string): Promise<void> => {
    await api.delete(`/profile/photos/${photoId}`);
  },
};
