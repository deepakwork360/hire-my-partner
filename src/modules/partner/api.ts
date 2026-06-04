import { partnerMockApi } from './api.mock';
import { partnerRealApi } from './api.real';

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE !== 'api';

// Switchable partner service bridge. Resolves statically from data folder
// or pulls in real-time from server endpoints based on active environmental mode.
export const partnerApi = IS_MOCK ? partnerMockApi : partnerRealApi;
