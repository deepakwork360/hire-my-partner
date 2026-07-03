import { createApiFallbackProxy } from '@/lib/apiFallback';
import { partnerMockApi } from './api.mock';
import { partnerRealApi } from './api.real';

// Switchable partner service bridge. Intercepts and falls back to mock if real API routes return 404 or are unreachable.
export const partnerApi = createApiFallbackProxy(partnerRealApi, partnerMockApi);
