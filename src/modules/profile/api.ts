import { profileMockApi } from './api.mock';
import { profileRealApi } from './api.real';

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE !== 'api';

// This acts as a switchable bridge. The frontend code is 100% oblivious to whether
// the source is the mock memory database or the real backend servers.
export const profileApi = IS_MOCK ? profileMockApi : profileRealApi;
