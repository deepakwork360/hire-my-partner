import { api } from '@/lib/axios';
import { Partner } from './types/partner.types';

export const partnerRealApi = {
  getPartners: async (): Promise<Partner[]> => {
    const { data } = await api.get('/partners');
    return data;
  },
  getPartnerById: async (id: string): Promise<Partner | null> => {
    const { data } = await api.get(`/partners/${id}`);
    return data;
  }
};
