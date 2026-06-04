import { Profile, UpdateProfilePayload } from './types';

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockProfile: Profile = {
  id: "prof_123",
  userId: "usr_temp",
  name: "johnny depp",
  age: 26,
  gender: "male",
  bio: "Passionate developer who loves UI/UX, traveling, and good food.",
  interests: ["coding", "traveling", "photography", "music"],
  photos: [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop"
  ],
  location: "New Delhi, India",
  preferences: {
    gender: "female",
    minAge: 21,
    maxAge: 30
  }
};

export const profileMockApi = {
  getMyProfile: async (): Promise<Profile> => {
    await delay(600);
    return { ...mockProfile };
  },
  updateProfile: async (data: UpdateProfilePayload): Promise<Profile> => {
    await delay(800);
    mockProfile = {
      ...mockProfile,
      ...data,
      preferences: {
        ...mockProfile.preferences,
        ...(data.preferences || {})
      }
    };
    return { ...mockProfile };
  },
  uploadPhoto: async (file: File): Promise<string> => {
    await delay(1200);
    // Create a local blob URL for visual feedback
    const mockUrl = URL.createObjectURL(file);
    mockProfile.photos.push(mockUrl);
    return mockUrl;
  },
  deletePhoto: async (photoId: string): Promise<void> => {
    await delay(500);
    mockProfile.photos = mockProfile.photos.filter(p => p !== photoId);
  }
};
