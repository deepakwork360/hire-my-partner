import { authMockApi } from './api.mock';
import { authRealApi } from './api.real';

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE !== 'api';

// Switchable interface bridge. Hides the mock database or real API implementation
// behind a unified export.
export const authApi = IS_MOCK ? authMockApi : authRealApi;
