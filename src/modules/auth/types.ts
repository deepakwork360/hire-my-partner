export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isProfileComplete: boolean;
}

export interface AuthResponse {
  user: User;
  token: string; // The access token, refresh token is httpOnly
}

export interface LoginPayload {
  emailOrPhone: string;
  password?: string;
  otp?: string;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface VerifyOtpPayload {
  emailOrPhone: string;
  otp: string;
  type: 'register' | 'login' | 'reset-password';
}

export interface ForgotPasswordPayload {
  emailOrPhone: string;
}

export interface ResetPasswordPayload {
  emailOrPhone: string;
  otp: string;
  newPassword: string;
}
