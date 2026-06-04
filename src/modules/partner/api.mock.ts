import { Partner } from './types/partner.types';
import { partners } from './data/partners';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const partnerMockApi = {
  getPartners: async (): Promise<Partner[]> => {
    await delay(600);
    return [...partners];
  },
  getPartnerById: async (id: string): Promise<Partner | null> => {
    await delay(400);
    const decodedId = decodeURIComponent(id).toLowerCase();
    const partner = partners.find((p) => {
      const rawIdMatch = String(p.id).toLowerCase() === decodedId;
      const nameSlug = p.name.toLowerCase().replace(/\s+/g, "-");
      const slugMatch = nameSlug === decodedId;
      return rawIdMatch || slugMatch;
    });
    return partner ? { ...partner } : null;
  }
};
