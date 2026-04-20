import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './api';
import { useAuthStore } from './store';
import { toast } from '@/components/ui/toastStore';
import { LoginPayload, RegisterPayload, VerifyOtpPayload, ForgotPasswordPayload, ResetPasswordPayload } from './types';
import axios from 'axios';

// Helper to extract message from axios error
const getErrorMsg = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'An unexpected error occurred';
};

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (data: RegisterPayload) => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      toast.success('Registration initiated. Please check your email/phone for OTP.');
      // Pass the email/phone to the next step via query param
      router.push(`/verify-otp?emailOrPhone=${encodeURIComponent(data.email || data.phone || '')}&type=register`);
    } catch (error) {
      toast.error(getErrorMsg(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (data: LoginPayload) => {
    setIsLoading(true);
    try {
      // If client requests an OTP instead of password login
      if (!data.password && !data.otp) {
        // Technically this shouldn't hit login if we do a prep-step, but assuming this is direct login
        // If the backend has a separate "request OTP for login" endpoint, you would call that here instead.
        throw new Error("Please provide password or OTP");
      }

      const response = await authApi.login(data);
      setAuth(response);
      toast.success('Login successful! Welcome back.');
      router.push('/dashboard'); // or whichever protected route
    } catch (error) {
      toast.error(getErrorMsg(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};

export const useVerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleVerify = async (data: VerifyOtpPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(data);
      if (response && response.token) {
        setAuth(response);
        toast.success('Verification successful!');
        router.push('/profile/setup'); // or dashboard
      } else {
        toast.info('OTP Verified successfully.');
        // some flows don't log you in directly, e.g. reset password
        if (data.type === 'reset-password') {
          router.push(`/reset-password?emailOrPhone=${encodeURIComponent(data.emailOrPhone)}&otp=${data.otp}`);
        }
      }
    } catch (error) {
      toast.error(getErrorMsg(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleVerify, isLoading };
};

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgot = async (data: ForgotPasswordPayload) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data);
      toast.success('OTP sent to your email/phone');
      router.push(`/verify-otp?emailOrPhone=${encodeURIComponent(data.emailOrPhone)}&type=reset-password`);
    } catch (error) {
      toast.error(getErrorMsg(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleForgot, isLoading };
};

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (data: ResetPasswordPayload) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword(data);
      toast.success('Password reset successfully. You can now login.');
      router.push('/login');
    } catch (error) {
      toast.error(getErrorMsg(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleReset, isLoading };
};
