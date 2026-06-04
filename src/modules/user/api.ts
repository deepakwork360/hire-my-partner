import { userMockApi } from './api.mock';
import { userRealApi } from './api.real';

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE !== 'api';

// Switchable user API bridge. Swaps dynamically between mock and real modes.
export const userApi = IS_MOCK ? userMockApi : userRealApi;
