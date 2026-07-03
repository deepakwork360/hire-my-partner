import { createApiFallbackProxy } from '@/lib/apiFallback';
import { authMockApi } from './api.mock';
import { authRealApi } from './api.real';

// Switchable interface bridge. Intercepts and falls back to mock if real API routes return 404 or are unreachable.
export const authApi = createApiFallbackProxy(authRealApi, authMockApi);
