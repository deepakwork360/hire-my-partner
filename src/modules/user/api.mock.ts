import { User } from './types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userMockApi = {
  getCurrentUser: async (): Promise<User> => {
    await delay(500);
    return {
      id: "usr_temp",
      name: "Johnny Depp",
      email: "johnny.depp@example.com",
      phone: "+919876543210",
      avatar: "",
      isVerified: true
    };
  },
  getUserById: async (userId: string): Promise<User> => {
    await delay(500);
    return {
      id: userId,
      name: "Johnny Depp",
      email: "johnny.depp@example.com",
      phone: "+919876543210",
      avatar: "",
      isVerified: true
    };
  }
};
