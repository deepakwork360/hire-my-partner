import { createApiFallbackProxy } from '@/lib/apiFallback';
import { profileMockApi } from './api.mock';
import { profileRealApi } from './api.real';

// This acts as a switchable bridge. Intercepts and falls back to mock if real API routes return 404 or are unreachable.
export const profileApi = createApiFallbackProxy(profileRealApi, profileMockApi);
