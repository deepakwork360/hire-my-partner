import axios from 'axios';

export function createApiFallbackProxy<T extends object>(realApi: T, mockApi: T): T {
  // If we are strictly in mock mode, bypass proxy and return mockApi directly for performance
  const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE !== 'api';
  if (IS_MOCK) {
    return mockApi;
  }

  return new Proxy(realApi, {
    get(target, prop, receiver) {
      const realValue = Reflect.get(target, prop, receiver);
      if (typeof realValue === 'function') {
        return async function (...args: any[]) {
          try {
            return await realValue.apply(target, args);
          } catch (error) {
            // Check if route is missing (404), server error (>= 500), or server is completely down/unreachable
            const isRouteMissingOrDown =
              axios.isAxiosError(error) &&
              (!error.response || error.response.status === 404 || error.response.status >= 500);

            if (isRouteMissingOrDown) {
              const mockValue = Reflect.get(mockApi, prop);
              if (typeof mockValue === 'function') {
                return await mockValue.apply(mockApi, args);
              }
            }
            throw error;
          }
        };
      }
      return realValue;
    }
  });
}
