import { 
  LoginPayload, 
  RegisterPayload, 
  VerifyOtpPayload, 
  ForgotPasswordPayload, 
  ResetPasswordPayload, 
  AuthResponse, 
  SendOtpPayload 
} from './types';
import { mockDb } from './data/users';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authMockApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    await delay(500);

    if (data.otp) {
      // OTP Login
      const isValid = mockDb.verifyOtp(data.emailOrPhone, data.otp);
      if (!isValid && data.otp !== "123456") {
        throw new Error("Invalid OTP. Use 123456 for testing.");
      }

      const existingUser = mockDb.findUser(data.emailOrPhone);
      const isEmail = data.emailOrPhone.includes('@');
      const user = existingUser || {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        name: isEmail ? data.emailOrPhone.split('@')[0] : "Test User",
        email: isEmail ? data.emailOrPhone : undefined,
        phone: !isEmail ? data.emailOrPhone : undefined,
        isProfileComplete: true,
      };

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          isProfileComplete: user.isProfileComplete,
          is_email_verified: true,
          is_phone_verified: true,
        },
        token: `mock_token_${Date.now()}`
      };
    }

    // Password Login
    const user = mockDb.findUser(data.emailOrPhone);
    if (!user) {
      throw new Error("User not found. Use sabrina@gmail.com or deepak@example.com for testing.");
    }

    if (data.password && user.password && data.password !== user.password) {
      throw new Error("Invalid password. Check test credentials displayed on page.");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
        is_email_verified: true,
        is_phone_verified: true,
      },
      token: `mock_token_${Date.now()}`
    };
  },

  sendLoginOtp: async (data: { emailOrPhone: string }): Promise<{ success: boolean }> => {
    await delay(300);
    mockDb.storeOtp(data.emailOrPhone, "123456");
    return { success: true };
  },

  register: async (data: RegisterPayload): Promise<{ success: boolean; message: string; data?: any }> => {
    await delay(600);
    const identifier = data.email || data.phone_no || data.name;
    try {
      mockDb.addUser(
        data.name,
        identifier,
        data.password,
        data.phone_no,
        data.app_language_code
      );
    } catch (e: any) {
      // Ignore duplicate error in mock db for ease of testing
    }
    mockDb.storeOtp(identifier, "123456");

    return {
      success: true,
      message: "Registration successful! Testing OTP is 123456.",
      data: { token: `mock_token_${Date.now()}` }
    };
  },

  sendOtp: async (data: SendOtpPayload): Promise<{ success: boolean; message: string; data?: any }> => {
    await delay(300);
    const key = data.email || data.phone_no || 'test';
    mockDb.storeOtp(key, "123456");
    return {
      success: true,
      message: "OTP sent successfully! Use 123456 for testing."
    };
  },

  verifyOtp: async (data: VerifyOtpPayload): Promise<AuthResponse> => {
    await delay(500);
    const key = data.emailOrPhone || data.email || data.phone_no || "";
    const isValid = mockDb.verifyOtp(key, data.otp) || data.otp === "123456";

    if (!isValid) {
      throw new Error("Invalid OTP code. Please enter 123456 for testing.");
    }

    const existing = mockDb.findUser(key);
    const isEmail = key.includes('@');
    const user = existing || {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: isEmail ? key.split('@')[0] : "Verified User",
      email: data.email || (isEmail ? key : undefined),
      phone: data.phone_no || (!isEmail ? key : undefined),
      isProfileComplete: true,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
        is_email_verified: true,
        is_phone_verified: true,
      },
      token: `mock_token_${Date.now()}`
    };
  },

  forgotPassword: async (data: ForgotPasswordPayload): Promise<{ success: boolean }> => {
    await delay(400);
    mockDb.storeOtp(data.emailOrPhone, "123456");
    return { success: true };
  },

  resetPassword: async (data: ResetPasswordPayload): Promise<{ success: boolean }> => {
    await delay(500);
    if (data.otp !== "123456" && !mockDb.verifyOtp(data.emailOrPhone, data.otp)) {
      throw new Error("Invalid OTP code. Use 123456 for testing.");
    }
    try {
      mockDb.updateUserPassword(data.emailOrPhone, data.newPassword);
    } catch (e) {
      // Ignore if user not found in mock db
    }
    return { success: true };
  }
};
