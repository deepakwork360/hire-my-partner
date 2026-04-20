export interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
  interests: string[];
  photos: string[];
  location: string;
  preferences: {
    gender: string;
    minAge: number;
    maxAge: number;
  };
}

export interface UpdateProfilePayload extends Partial<Omit<Profile, 'id' | 'userId' | 'photos'>> {
  photos?: string[];
}
