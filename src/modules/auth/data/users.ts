import { User } from '../types';

export interface MockUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  isProfileComplete: boolean;
}

const DEFAULT_USERS: MockUser[] = [
  {
    id: "usr_gigi",
    name: "Gigi Hadid",
    email: "gigi@example.com",
    password: "password123",
    avatar: "https://i1-e.pinimg.com/736x/8f/1d/57/8f1d57309aaeca11bb53cb12fc84f28a.jpg",
    isProfileComplete: true,
  },
  {
    id: "usr_deepak",
    name: "Deepak Bisht",
    email: "deepak@example.com",
    phone: "9999999999",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=33",
    isProfileComplete: true,
  },
  {
    id: "usr_john",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=12",
    isProfileComplete: false,
  }
];

const USERS_KEY = 'meetme_mock_users';
const OTPS_KEY = 'meetme_mock_otps';

// In-memory fallbacks for server-side rendering or environments without localStorage
let inMemoryUsers: MockUser[] = [...DEFAULT_USERS];
let inMemoryOtps: Record<string, { otp: string; timestamp: number }> = {};

function getStorageItem(key: string): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
  }
  return null;
}

function setStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Error writing to localStorage', e);
    }
  }
}

export const mockDb = {
  getUsers(): MockUser[] {
    const stored = getStorageItem(USERS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return inMemoryUsers;
      }
    }
    // Initialize if not present
    this.saveUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  },

  saveUsers(users: MockUser[]) {
    inMemoryUsers = users;
    setStorageItem(USERS_KEY, JSON.stringify(users));
  },

  findUser(emailOrPhone: string): MockUser | undefined {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const users = this.getUsers();
    return users.find(u => 
      (u.email && u.email.toLowerCase() === cleanInput) || 
      (u.phone && u.phone === cleanInput) ||
      (u.phone && u.phone.replace(/[\s+-]/g, '') === cleanInput.replace(/[\s+-]/g, ''))
    );
  },

  addUser(name: string, emailOrPhone: string, password?: string): MockUser {
    const isEmail = emailOrPhone.includes('@');
    const email = isEmail ? emailOrPhone.trim().toLowerCase() : undefined;
    const phone = !isEmail ? emailOrPhone.trim() : undefined;
    
    // Check if user already exists
    const existing = this.findUser(emailOrPhone);
    if (existing) {
      throw new Error(`User with this ${isEmail ? 'email' : 'phone number'} already exists`);
    }

    const newUser: MockUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone,
      password,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      isProfileComplete: false
    };

    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  },

  updateUserPassword(emailOrPhone: string, newPassword: string): void {
    const users = this.getUsers();
    const user = this.findUser(emailOrPhone);
    if (!user) {
      throw new Error("User not found");
    }

    const updated = users.map(u => {
      if (u.id === user.id) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    this.saveUsers(updated);
  },

  storeOtp(emailOrPhone: string, otp: string): void {
    const cleanKey = emailOrPhone.trim().toLowerCase();
    const otps = this.getOtps();
    otps[cleanKey] = { otp, timestamp: Date.now() };
    inMemoryOtps[cleanKey] = { otp, timestamp: Date.now() };
    setStorageItem(OTPS_KEY, JSON.stringify(otps));
  },

  getOtps(): Record<string, { otp: string; timestamp: number }> {
    const stored = getStorageItem(OTPS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return inMemoryOtps;
      }
    }
    return inMemoryOtps;
  },

  verifyOtp(emailOrPhone: string, otp: string): boolean {
    // For standard testing simplicity, "123456" is always a valid OTP
    if (otp === "123456") {
      return true;
    }

    const cleanKey = emailOrPhone.trim().toLowerCase();
    const otps = this.getOtps();
    const record = otps[cleanKey];
    if (record && record.otp === otp) {
      // Clean up OTP after successful verification
      delete otps[cleanKey];
      setStorageItem(OTPS_KEY, JSON.stringify(otps));
      return true;
    }
    return false;
  }
};
