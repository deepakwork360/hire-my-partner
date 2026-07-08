import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './api';
import { useAuthStore } from './store';
import { toast } from '@/components/ui/toastStore';
import { LoginPayload, RegisterPayload, VerifyOtpPayload, ForgotPasswordPayload, ResetPasswordPayload, SendOtpPayload } from './types';
import axios from 'axios';

// Helper to extract message from axios error
const getErrorMsg = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && data.errors && typeof data.errors === 'object') {
      // Gather validation error messages
      const messages = Object.entries(data.errors)
        .map(([field, msgs]) => {
          if (Array.isArray(msgs)) {
            return msgs.join(', ');
          }
          return String(msgs);
        })
        .join(' ');
      if (messages) {
        return messages;
      }
    }
    return data?.message || error.message;
  }
  return 'An unexpected error occurred';
};

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (data: RegisterPayload) => {
    setIsLoading(true);

    try {
      // 1. Register user
      const response = await authApi.register(data);

      // 2. Automatically send Email OTP
      await authApi.sendOtp({
        type: 'register',
        send_via: 'email',
        email: data.email || '',
        phone_no: data.phone_no || '',
        phone_country_code: data.phone_country_code || '',
      });

      toast.success(response.message || 'OTP sent to your email.');

      // 3. Save verification details
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'otp_verification_data',
          JSON.stringify({
            type: 'register',
            send_via: 'email',
            phone_no: data.phone_no || '',
            phone_country_code: data.phone_country_code || '',
            email: data.email || '',
            emailOrPhone: data.email || data.phone_no || '',
          })
        );
      }

      // 4. Go to Email OTP screen
      router.push('/verify-otp');
    } catch (error) {
      toast.error(getErrorMsg(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
};

export const useSendOtp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (data: SendOtpPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.sendOtp(data);
      toast.success(response.message || 'OTP sent successfully');
      return response;
    } catch (error) {
      toast.error(getErrorMsg(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSendOtp, isLoading };
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (data: LoginPayload, redirectUrl?: string | null) => {
    setIsLoading(true);
    try {
      // If client requests an OTP instead of password login
      if (!data.password && !data.otp) {
        // Technically this shouldn't hit login if we do a prep-step, but assuming this is direct login
        // If the backend has a separate "request OTP for login" endpoint, you would call that here instead.
        throw new Error("Please provide password or OTP");
      }

      const response = await authApi.login(data);
      console.log("LOGIN RESPONSE USER:", response.user);

      // Determine if email and phone are verified using a helper
      const isVerifiedField = (val: any) => {
        if (val === true || val === 1 || val === "1" || val === "true") return true;
        if (typeof val === "string" && val.trim() !== "" && val !== "null") return true;
        return false;
      };

      const isEmailVerified = 
        isVerifiedField(response.user.is_email_verified) || 
        isVerifiedField(response.user.email_verified_at);
        
      const isPhoneVerified = 
        isVerifiedField(response.user.is_phone_verified) || 
        isVerifiedField(response.user.phone_verified_at) ||
        isVerifiedField(response.user.phone_no_verified_at);

      if (!isEmailVerified || !isPhoneVerified) {
        toast.info("Please verify your account to log in.");
        
        // Determine the next step and target
        const emailOrPhone = response.user.email || response.user.phone || data.emailOrPhone;
        const sendVia = !isEmailVerified ? "email" : "phone";
        
        // 1. Send the OTP for verification
        try {
          await authApi.sendOtp({
            type: 'register',
            send_via: sendVia,
            email: response.user.email || '',
            phone_no: response.user.phone || '',
            phone_country_code: response.user.phone_country_code || '',
          });
        } catch (sendErr) {
          console.error("Failed to automatically send OTP on login interception:", sendErr);
        }

        // 2. Save verification details in sessionStorage so VerifyOtpPage knows what to do
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'otp_verification_data',
            JSON.stringify({
              type: 'register',
              send_via: sendVia,
              phone_no: response.user.phone || '',
              phone_country_code: response.user.phone_country_code || '',
              email: response.user.email || '',
              emailOrPhone: emailOrPhone,
            })
          );
        }

        // 3. Redirect to Verify OTP page
        router.push('/verify-otp');
        return;
      }

      setAuth(response);
      toast.success('Login successful! Welcome back.');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/become-a-partner'); // Redirect to become-a-partner page
      }
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
      if (data.type === 'forget' || data.type === 'reset-password') {
        // Skip calling verifyOtp API so the OTP is not consumed/deleted.
        // Redirect directly to the reset-password page where both OTP and password will be submitted.
        toast.info('Redirecting to reset password...');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('reset_password_data', JSON.stringify({
            emailOrPhone: data.emailOrPhone,
            otp: data.otp
          }));
        }
        router.push(`/reset-password`);
        return;
      }

      const response = await authApi.verifyOtp(data);
      if (data.type === 'register') {
        if (data.send_via === 'email') {
          toast.success('Email verified successfully! Sending verification code to your phone number.');
          try {
            await authApi.sendOtp({
              type: 'register',
              send_via: 'phone',
              phone_no: data.phone_no || '',
              phone_country_code: data.phone_country_code || '',
              email: data.email || ''
            });
          } catch (sendErr) {
            console.error("Failed to send phone OTP:", sendErr);
          }

          if (typeof window !== 'undefined') {
            const sessionData = sessionStorage.getItem('otp_verification_data');
            if (sessionData) {
              const parsed = JSON.parse(sessionData);
              parsed.send_via = 'phone';
              sessionStorage.setItem('otp_verification_data', JSON.stringify(parsed));
            }
          }
          window.location.reload();
          return;
        }

        toast.success('Phone verified successfully! Please log in.');
        const username = data.phone_no || data.email || data.emailOrPhone;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('login_autofill_data', username);
        }
        router.push(`/login`);
      } else if (response && response.token) {
        setAuth(response);
        toast.success('Verification successful!');
        router.push('/become-a-partner');
      } else {
        toast.info('OTP Verified successfully.');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('reset_password_data', JSON.stringify({
            emailOrPhone: data.emailOrPhone,
            otp: data.otp
          }));
        }
        router.push(`/reset-password`);
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
      toast.success('OTP sent successfully!');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('otp_verification_data', JSON.stringify({
          type: 'forget',
          emailOrPhone: data.emailOrPhone,
          send_via: data.emailOrPhone.includes('@') ? 'email' : 'phone'
        }));
      }
      router.push(`/verify-otp`);
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
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('reset_password_data');
        sessionStorage.removeItem('otp_verification_data');
      }
      router.push('/login');
    } catch (error) {
      toast.error(getErrorMsg(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleReset, isLoading };
};
