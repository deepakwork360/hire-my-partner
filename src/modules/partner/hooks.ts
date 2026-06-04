import { useQuery } from '@tanstack/react-query';
import { partnerApi } from './api';
import { Partner } from './types/partner.types';

// React Query hook to fetch the complete list of partners with automatic caching.
export const usePartners = () => {
  return useQuery<Partner[], Error>({
    queryKey: ['partners'],
    queryFn: () => partnerApi.getPartners(),
    staleTime: 5 * 60 * 1000, // Cache list for 5 minutes
  });
};

// React Query hook to fetch a specific partner's profile by ID/slug with caching.
export const usePartnerDetails = (id: string) => {
  return useQuery<Partner | null, Error>({
    queryKey: ['partner', id],
    queryFn: () => partnerApi.getPartnerById(id),
    enabled: !!id, // Only run the query if a valid ID is provided
    staleTime: 10 * 60 * 1000, // Cache individual profile for 10 minutes
  });
};
