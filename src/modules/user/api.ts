import { createApiFallbackProxy } from '@/lib/apiFallback';
import { userMockApi } from './api.mock';
import { userRealApi } from './api.real';

// Switchable user API bridge. Intercepts and falls back to mock if real API routes return 404 or are unreachable.
export const userApi = createApiFallbackProxy(userRealApi, userMockApi);
