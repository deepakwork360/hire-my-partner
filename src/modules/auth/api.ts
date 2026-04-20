import { api } from '@/lib/axios';
import { LoginPayload, RegisterPayload, VerifyOtpPayload, ForgotPasswordPayload, ResetPasswordPayload, AuthResponse } from './types';

export const authApi = {
  login: async (data: LoginPayload) => {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },
  
  register: async (data: RegisterPayload) => {
    // Note: Depends on backend returning simple success or maybe partial user obj
    // Blueprint implies after register -> wait for OTP
    const response = await api.post('/register', data);
    return response.data;
  },
  
  verifyOtp: async (data: VerifyOtpPayload) => {
    // Returns full AuthResponse on success. Overwrites current token.
    const response = await api.post<AuthResponse>('/verify-otp', data);
    return response.data;
  },
  
  forgotPassword: async (data: ForgotPasswordPayload) => {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },
  
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await api.post('/reset-password', data);
    return response.data;
  }
};
