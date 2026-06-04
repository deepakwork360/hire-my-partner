import { api } from '@/lib/axios';
import { LoginPayload, RegisterPayload, VerifyOtpPayload, ForgotPasswordPayload, ResetPasswordPayload, AuthResponse } from './types';

export const authRealApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const { data: responseData } = await api.post('/auth/login', data);
    return responseData;
  },

  sendLoginOtp: async (data: { emailOrPhone: string }): Promise<{ success: boolean }> => {
    const { data: responseData } = await api.post('/auth/login/send-otp', data);
    return responseData;
  },
  
  register: async (data: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    const { data: responseData } = await api.post('/auth/register', data);
    return responseData;
  },
  
  verifyOtp: async (data: VerifyOtpPayload): Promise<AuthResponse> => {
    const { data: responseData } = await api.post('/auth/verify-otp', data);
    return responseData;
  },
  
  forgotPassword: async (data: ForgotPasswordPayload): Promise<{ success: boolean }> => {
    const { data: responseData } = await api.post('/auth/forgot-password', data);
    return responseData;
  },
  
  resetPassword: async (data: ResetPasswordPayload): Promise<{ success: boolean }> => {
    const { data: responseData } = await api.post('/auth/reset-password', data);
    return responseData;
  }
};
