import { User } from '../types';

export interface MockUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  isProfileComplete: boolean;
  app_language_code?: string;
}

const DEFAULT_USERS: MockUser[] = [
  {
    id: "usr_sabrina",
    name: "Sabrina Carpenter",
    email: "sabrina@gmail.com",
    password: "sabrina@123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
    isProfileComplete: true,
  },
  {
    id: "usr_gigi",
    name: "Gigi Hadid",
    email: "gigi@example.com",
    password: "password123",
    avatar: "https://i.pinimg.com/736x/c0/ba/42/c0ba427bac83d08188867c3b42133c98.jpg",
    isProfileComplete: true,
  },
  {
    id: "usr_deepak",
    name: "Deepak Bisht",
    email: "deepak@example.com",
    phone: "9999999999",
    password: "password123",
    avatar: "https://i.pinimg.com/736x/ce/21/07/ce21071acfd1e9deb34850f70285a5f0.jpg",
    isProfileComplete: true,
  },
  {
    id: "usr_john",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "",
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
        const parsed = JSON.parse(stored) as MockUser[];
        const hasSabrina = parsed.some(u => u.email === "sabrina@gmail.com");
        if (!hasSabrina) {
          const sabrina = DEFAULT_USERS.find(u => u.email === "sabrina@gmail.com");
          if (sabrina) {
            parsed.push(sabrina);
            this.saveUsers(parsed);
          }
        }
        return parsed;
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

  addUser(name: string, emailOrPhone: string, password?: string, phone?: string, appLanguageCode?: string): MockUser {
    let email: string | undefined;
    let finalPhone: string | undefined;

    if (phone) {
      email = emailOrPhone.trim().toLowerCase();
      finalPhone = phone.trim();
    } else {
      const isEmail = emailOrPhone.includes('@');
      email = isEmail ? emailOrPhone.trim().toLowerCase() : undefined;
      finalPhone = !isEmail ? emailOrPhone.trim() : undefined;
    }
    
    // Check if user already exists
    const users = this.getUsers();
    const existing = users.find(u => 
      (email && u.email && u.email.toLowerCase() === email.toLowerCase()) || 
      (finalPhone && u.phone && u.phone === finalPhone)
    );
    if (existing) {
      throw new Error(`User with this email or phone number already exists`);
    }

    const newUser: MockUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone: finalPhone,
      password,
      avatar: "",
      isProfileComplete: false,
      app_language_code: appLanguageCode
    };

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
    // For standard testing simplicity, "123456", "490595", "751405", and "651142" are always valid OTPs
    if (otp === "123456" || otp === "490595" || otp === "751405" || otp === "651142") {
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
