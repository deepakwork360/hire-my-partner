export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isProfileComplete: boolean;
  gender?: string;
  age?: string;
  address?: string;
  city?: string;
  phone_country_code?: string;
  country?: string;
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
  phone_country_code?: string;
  phone_no?: string;
  app_language_code?: string;
}

export interface SendOtpPayload {
  type: 'register' | 'login' | 'reset-password' | 'forget';
  send_via: 'phone' | 'email';
  phone_no?: string;
  phone_country_code?: string;
  email?: string;
}

export interface VerifyOtpPayload {
  emailOrPhone: string;
  otp: string;
  type: 'register' | 'login' | 'reset-password' | 'forget';
  send_via?: 'phone' | 'email';
  phone_no?: string;
  phone_country_code?: string;
  email?: string;
}

export interface ForgotPasswordPayload {
  emailOrPhone: string;
}

export interface ResetPasswordPayload {
  emailOrPhone: string;
  otp: string;
  newPassword: string;
}
