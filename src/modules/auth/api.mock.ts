import { LoginPayload, RegisterPayload, VerifyOtpPayload, ForgotPasswordPayload, ResetPasswordPayload, AuthResponse, SendOtpPayload } from './types';
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
      const isOtpValid = mockDb.verifyOtp(data.emailOrPhone, data.otp) || (user.phone && mockDb.verifyOtp(user.phone, data.otp));
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

    // Generate mock OTP (using "751405" to match the screenshot)
    const mockOtp = "751405";
    mockDb.storeOtp(data.emailOrPhone, mockOtp);
    if (user.phone) {
      mockDb.storeOtp(user.phone, mockOtp);
    }

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
  
  register: async (data: RegisterPayload): Promise<{ success: boolean; message: string; data?: any }> => {
    await delay(800);
    
    const email = data.email || "";
    const phone = data.phone_no || "";
    
    // Check if user already exists
    const users = mockDb.getUsers();
    const existing = users.find(u => 
      (email && u.email && u.email.toLowerCase() === email.toLowerCase()) || 
      (phone && u.phone && u.phone === phone)
    );
    if (existing) {
      throw new Error("An account already exists with this email or phone number");
    }

    // Add user as pending
    mockDb.addUser(data.name, email, data.password, phone, data.app_language_code);
    
    const phoneOtp = "376169";
    const emailOtp = "511846";
    mockDb.storeOtp(phone, phoneOtp);
    mockDb.storeOtp(email, emailOtp);

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        toast.info(`[Testing] Registration OTPs - Phone: ${phoneOtp} | Email: ${emailOtp}`);
      }, 100);
    }
    
    return {
      success: true,
      message: 'Registered successfully. Verify both email and phone OTP.',
      data: {
        user_id: 102,
        email,
        phone_country_code: data.phone_country_code,
        phone_no: phone,
        email_otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        phone_otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        email_otp: emailOtp,
        phone_otp: phoneOtp,
        user: {
          id: 102,
          name: data.name,
          email,
          profile_image: null,
          phone_country_code: data.phone_country_code,
          phone_no: phone,
          fcm_token: null,
          kyc_status: "not_submitted",
          account_type: "user",
          partner_status: "not_applied",
          email_verified_at: null,
          phone_no_verified_at: null,
          status: "active",
          profile: null
        }
      }
    };
  },

  sendOtp: async (data: SendOtpPayload): Promise<{ success: boolean; message: string; data?: any }> => {
    await delay(800);
    
    const target = data.phone_no || data.email || "";
    
    // Generate a mock OTP (use "490595" to match the screenshot)
    const mockOtp = "490595";
    mockDb.storeOtp(target, mockOtp);
    
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        toast.info(`[Testing] OTP for ${target} is: ${mockOtp}`);
      }, 100);
    }
    
    return {
      success: true,
      message: "OTP sent successfully",
      data: {
        type: data.type,
        send_via: data.send_via,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        otp: mockOtp
      }
    };
  },
  
  verifyOtp: async (data: VerifyOtpPayload): Promise<AuthResponse> => {
    await delay(800);
    
    const target = data.phone_no || data.emailOrPhone || "";
    const isOtpValid = mockDb.verifyOtp(target, data.otp);
    if (!isOtpValid) {
      throw new Error("Invalid OTP code. Try entering '490595' for testing.");
    }

    const user = mockDb.findUser(target);
    const resolvedUser = user || {
      id: "usr_temp",
      name: "Temporary User",
      email: target.includes('@') ? target : undefined,
      phone: !target.includes('@') ? target : undefined,
      avatar: "",
      isProfileComplete: false,
    };

    if (data.type === 'reset-password' || data.type === 'forget') {
      return {
        user: {
          id: resolvedUser.id,
          name: resolvedUser.name,
          email: resolvedUser.email,
          phone: resolvedUser.phone,
          avatar: resolvedUser.avatar,
          isProfileComplete: resolvedUser.isProfileComplete,
        },
        token: ""
      };
    }
    
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

    // Generate mock OTP (using "651142" to match the screenshot)
    const mockOtp = "651142";
    mockDb.storeOtp(data.emailOrPhone, mockOtp);
    if (user.phone) {
      mockDb.storeOtp(user.phone, mockOtp);
    }

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
