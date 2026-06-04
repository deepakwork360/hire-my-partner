import { LoginPayload, RegisterPayload, VerifyOtpPayload, ForgotPasswordPayload, ResetPasswordPayload, AuthResponse } from './types';
import { mockDb } from './data/users';
import { toast } from '@/components/ui/toastStore';

// Helper to simulate network latency for realistic loaders and transitions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authMockApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    await delay(800);
    
    const user = mockDb.findUser(data.emailOrPhone);
    if (!user) {
      throw new Error("No account found with this email or phone number");
    }

    if (data.otp) {
      const isOtpValid = mockDb.verifyOtp(data.emailOrPhone, data.otp);
      if (!isOtpValid) {
        throw new Error("Invalid OTP code");
      }
    } else if (data.password) {
      if (user.password !== data.password) {
        throw new Error("Invalid password");
      }
    } else {
      throw new Error("Password or OTP is required");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
      },
      token: "mock-jwt-token-xyz"
    };
  },

  sendLoginOtp: async (data: { emailOrPhone: string }): Promise<{ success: boolean }> => {
    await delay(800);
    
    const user = mockDb.findUser(data.emailOrPhone);
    if (!user) {
      throw new Error("No account found with this email or phone number. Please sign up first.");
    }

    // Generate mock OTP
    const mockOtp = "123456";
    mockDb.storeOtp(data.emailOrPhone, mockOtp);

    // Notify the tester
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        toast.info(`[Testing] Login OTP for ${data.emailOrPhone} is: ${mockOtp}`);
      }, 100);
    }

    return {
      success: true
    };
  },
  
  register: async (data: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    await delay(800);
    
    const emailOrPhone = data.email || data.phone || "";
    const existing = mockDb.findUser(emailOrPhone);
    if (existing) {
      throw new Error("An account already exists with this email or phone number");
    }

    // Add user as pending (or direct register)
    mockDb.addUser(data.name, emailOrPhone, data.password);
    
    // Generate a mock OTP
    const mockOtp = "123456";
    mockDb.storeOtp(emailOrPhone, mockOtp);

    // Notify the tester
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        toast.info(`[Testing] Verification OTP for ${emailOrPhone} is: ${mockOtp}`);
      }, 100);
    }

    return {
      success: true,
      message: 'Registration initiated.'
    };
  },
  
  verifyOtp: async (data: VerifyOtpPayload): Promise<AuthResponse> => {
    await delay(800);
    
    const isOtpValid = mockDb.verifyOtp(data.emailOrPhone, data.otp);
    if (!isOtpValid) {
      throw new Error("Invalid OTP code. Try entering '123456' for testing.");
    }

    const user = mockDb.findUser(data.emailOrPhone);
    const resolvedUser = user || {
      id: "usr_temp",
      name: "Temporary User",
      email: data.emailOrPhone.includes('@') ? data.emailOrPhone : undefined,
      phone: !data.emailOrPhone.includes('@') ? data.emailOrPhone : undefined,
      avatar: "https://i.pravatar.cc/150",
      isProfileComplete: false,
    };

    // For reset-password flow, return an empty token to trigger the correct redirection flow in verify-otp hook
    if (data.type === 'reset-password') {
      return {
        user: {
          id: resolvedUser.id,
          name: resolvedUser.name,
          email: resolvedUser.email,
          phone: resolvedUser.phone,
          avatar: resolvedUser.avatar,
          isProfileComplete: resolvedUser.isProfileComplete,
        },
        token: "" // Empty string acts as a falsy token, redirecting to the reset password form correctly
      };
    }
    
    // For register and login flows, log the user in directly by returning a token
    return {
      user: {
        id: resolvedUser.id,
        name: resolvedUser.name,
        email: resolvedUser.email,
        phone: resolvedUser.phone,
        avatar: resolvedUser.avatar,
        isProfileComplete: resolvedUser.isProfileComplete,
      },
      token: "mock-jwt-token-xyz"
    };
  },
  
  forgotPassword: async (data: ForgotPasswordPayload): Promise<{ success: boolean }> => {
    await delay(800);
    
    const user = mockDb.findUser(data.emailOrPhone);
    if (!user) {
      throw new Error("No account found with this email or phone number");
    }

    // Generate mock OTP
    const mockOtp = "123456";
    mockDb.storeOtp(data.emailOrPhone, mockOtp);

    // Notify the tester
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        toast.info(`[Testing] Password reset OTP is: ${mockOtp}`);
      }, 100);
    }

    return {
      success: true
    };
  },
  
  resetPassword: async (data: ResetPasswordPayload): Promise<{ success: boolean }> => {
    await delay(800);
    
    const isOtpValid = mockDb.verifyOtp(data.emailOrPhone, data.otp);
    if (!isOtpValid) {
      throw new Error("Invalid or expired OTP. Please request a new password reset.");
    }

    const user = mockDb.findUser(data.emailOrPhone);
    if (!user) {
      throw new Error("User not found");
    }

    mockDb.updateUserPassword(data.emailOrPhone, data.newPassword);

    return {
      success: true
    };
  }
};
