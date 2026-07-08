import { api } from '@/lib/axios';
import { LoginPayload, RegisterPayload, VerifyOtpPayload, ForgotPasswordPayload, ResetPasswordPayload, AuthResponse, SendOtpPayload } from './types';

export const authRealApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    let response: any;
    if (data.otp) {
      // Login with OTP (uses verify-otp)
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailOrPhone);
      let sendVia: 'phone' | 'email' = isEmail ? 'email' : 'phone';
      let phoneNo = '';
      let phoneCountryCode = '+91';
      let email = '';

      if (isEmail) {
        email = data.emailOrPhone;
      } else {
        const cleanPhone = data.emailOrPhone.replace(/\s+/g, '');
        if (cleanPhone.startsWith('+')) {
          if (cleanPhone.startsWith('+91')) {
            phoneCountryCode = '+91';
            phoneNo = cleanPhone.slice(3);
          } else {
            phoneCountryCode = cleanPhone.slice(0, 3);
            phoneNo = cleanPhone.slice(3);
          }
        } else {
          phoneCountryCode = '+91';
          phoneNo = cleanPhone;
        }
      }

      const { data: res } = await api.post('/auth/verify-otp', {
        type: 'login',
        send_via: sendVia,
        phone_no: phoneNo || undefined,
        phone_country_code: phoneNo ? phoneCountryCode : undefined,
        email: email || undefined,
        otp: data.otp
      });
      response = res;
    } else {
      // Login with Email / Password
      const { data: res } = await api.post('/auth/login/email', {
        email: data.emailOrPhone,
        password: data.password
      });
      response = res;
    }

    const resData = response.data || response;
    const user = resData.user || {};

    return {
      user: {
        id: user.id || user.user_id || "usr_temp",
        name: user.name || "User",
        email: user.email,
        phone: user.phone || user.phone_no,
        avatar: user.avatar || user.profile_image,
        isProfileComplete: user.isProfileComplete || false,
        is_email_verified: user.is_email_verified,
        is_phone_verified: user.is_phone_verified,
        email_verified_at: user.email_verified_at,
        phone_verified_at: user.phone_verified_at,
        phone_no_verified_at: user.phone_no_verified_at,
        phone_country_code: user.phone_country_code
      },
      token: resData.token
    };
  },

  sendLoginOtp: async (data: { emailOrPhone: string }): Promise<{ success: boolean }> => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailOrPhone);
    let sendVia: 'phone' | 'email' = isEmail ? 'email' : 'phone';
    let phoneNo = '';
    let phoneCountryCode = '+91';
    let email = '';

    if (isEmail) {
      email = data.emailOrPhone;
    } else {
      const cleanPhone = data.emailOrPhone.replace(/\s+/g, '');
      if (cleanPhone.startsWith('+')) {
        if (cleanPhone.startsWith('+91')) {
          phoneCountryCode = '+91';
          phoneNo = cleanPhone.slice(3);
        } else {
          phoneCountryCode = cleanPhone.slice(0, 3);
          phoneNo = cleanPhone.slice(3);
        }
      } else {
        phoneCountryCode = '+91';
        phoneNo = cleanPhone;
      }
    }

    const { data: responseData } = await api.post('/auth/send-otp', {
      type: 'login',
      send_via: sendVia,
      phone_no: phoneNo || undefined,
      phone_country_code: phoneNo ? phoneCountryCode : undefined,
      email: email || undefined
    });
    return {
      success: responseData.status
    };
  },
  
  register: async (data: RegisterPayload): Promise<{ success: boolean; message: string; data?: any }> => {
    const { data: responseData } = await api.post('/auth/register', data);
    return {
      success: responseData.status,
      message: responseData.message,
      data: responseData.data
    };
  },

  sendOtp: async (data: SendOtpPayload): Promise<{ success: boolean; message: string; data?: any }> => {
    const { data: responseData } = await api.post('/auth/send-otp', data);
    return {
      success: responseData.status,
      message: responseData.message,
      data: responseData.data
    };
  },
  
  verifyOtp: async (data: VerifyOtpPayload): Promise<AuthResponse> => {
    const { data: responseData } = await api.post('/auth/verify-otp', data);
    
    const token = responseData.token || responseData.data?.token || responseData.data?.access_token || "";
    
    if (data.type === 'reset-password' || data.type === 'forget' || !token) {
      return {
        user: {} as any,
        token
      };
    }

    try {
      const userDirect = responseData.user || responseData.data?.user;
      if (userDirect) {
        return {
          user: {
            id: userDirect.id || userDirect.user_id || "usr_temp",
            name: userDirect.name || "User",
            email: userDirect.email,
            phone: userDirect.phone || userDirect.phone_no,
            avatar: userDirect.avatar,
            isProfileComplete: userDirect.isProfileComplete || false,
            is_email_verified: userDirect.is_email_verified,
            is_phone_verified: userDirect.is_phone_verified,
            email_verified_at: userDirect.email_verified_at,
            phone_verified_at: userDirect.phone_verified_at,
            phone_no_verified_at: userDirect.phone_no_verified_at,
            phone_country_code: userDirect.phone_country_code
          },
          token
        };
      }

      const { data: userData } = await api.get('/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const user = userData.data || userData;
      return {
        user: {
          id: user.id || user.user_id || "usr_temp",
          name: user.name || "User",
          email: user.email,
          phone: user.phone || user.phone_no,
          avatar: user.avatar,
          isProfileComplete: user.isProfileComplete || false,
          is_email_verified: user.is_email_verified,
          is_phone_verified: user.is_phone_verified,
          email_verified_at: user.email_verified_at,
          phone_verified_at: user.phone_verified_at,
          phone_no_verified_at: user.phone_no_verified_at,
          phone_country_code: user.phone_country_code
        },
        token
      };
    } catch (e) {
      console.error("Failed to fetch user profile after OTP verification", e);
      const isEmail = data.send_via === 'email';
      const nowStr = new Date().toISOString();
      return {
        user: {
          id: "usr_temp",
          name: data.phone_no || data.emailOrPhone,
          email: data.email || (data.emailOrPhone.includes('@') ? data.emailOrPhone : undefined),
          phone: data.phone_no || (!data.emailOrPhone.includes('@') ? data.emailOrPhone : undefined),
          isProfileComplete: false,
          is_email_verified: true,
          email_verified_at: nowStr,
          is_phone_verified: !isEmail,
          phone_verified_at: !isEmail ? nowStr : null
        },
        token
      };
    }
  },
  
  forgotPassword: async (data: ForgotPasswordPayload): Promise<{ success: boolean }> => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailOrPhone);
    let sendVia: 'phone' | 'email' = isEmail ? 'email' : 'phone';
    let phoneNo = '';
    let phoneCountryCode = '+91';
    let email = '';

    if (isEmail) {
      email = data.emailOrPhone;
    } else {
      const cleanPhone = data.emailOrPhone.replace(/\s+/g, '');
      if (cleanPhone.startsWith('+')) {
        if (cleanPhone.startsWith('+91')) {
          phoneCountryCode = '+91';
          phoneNo = cleanPhone.slice(3);
        } else {
          phoneCountryCode = cleanPhone.slice(0, 3);
          phoneNo = cleanPhone.slice(3);
        }
      } else {
        phoneCountryCode = '+91';
        phoneNo = cleanPhone;
      }
    }

    const { data: responseData } = await api.post('/auth/send-otp', {
      type: 'forget',
      send_via: sendVia,
      phone_no: phoneNo || undefined,
      phone_country_code: phoneNo ? phoneCountryCode : undefined,
      email: email || undefined
    });
    return {
      success: responseData.status
    };
  },
  
  resetPassword: async (data: ResetPasswordPayload): Promise<{ success: boolean }> => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailOrPhone);
    let sendVia: 'phone' | 'email' = isEmail ? 'email' : 'phone';
    let phoneNo = '';
    let phoneCountryCode = '+91';
    let email = '';

    if (isEmail) {
      email = data.emailOrPhone;
    } else {
      const cleanPhone = data.emailOrPhone.replace(/\s+/g, '');
      if (cleanPhone.startsWith('+')) {
        if (cleanPhone.startsWith('+91')) {
          phoneCountryCode = '+91';
          phoneNo = cleanPhone.slice(3);
        } else {
          phoneCountryCode = cleanPhone.slice(0, 3);
          phoneNo = cleanPhone.slice(3);
        }
      } else {
        phoneCountryCode = '+91';
        phoneNo = cleanPhone;
      }
    }

    const { data: responseData } = await api.post('/auth/forgot-password/reset', {
      send_via: sendVia,
      phone_no: phoneNo || undefined,
      phone_country_code: phoneNo ? phoneCountryCode : undefined,
      email: email || undefined,
      otp: data.otp,
      token: data.otp,
      password: data.newPassword,
      password_confirmation: data.newPassword
    });
    return {
      success: responseData.status
    };
  }
};
