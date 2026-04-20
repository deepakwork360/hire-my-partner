import { z } from 'zod';

export const phoneOrEmailSchema = z.string().superRefine((val, ctx) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhone = /^\+?[\d\s-]{10,15}$/.test(val);
  
  if (!isEmail && !isPhone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must be a valid email or phone number',
    });
  }
});

export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long');
export const otpSchema = z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers');

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  emailOrPhone: phoneOrEmailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  emailOrPhone: phoneOrEmailSchema,
  password: z.string().optional(),
  otp: z.string().optional(),
}).refine(data => data.password || (data.otp && data.otp.length === 6), {
  message: 'Either password or valid OTP is required',
  path: ['password']
});

export const verifyOtpSchema = z.object({
  emailOrPhone: phoneOrEmailSchema,
  otp: otpSchema,
});
