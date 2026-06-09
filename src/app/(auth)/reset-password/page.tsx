"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPassword } from "@/modules/auth/hooks";
import { passwordSchema } from "@/modules/auth/validation";
import { toast } from "@/components/ui/toastStore";
import Link from "next/link";
import Image from "next/image";
import ThemeLogo from "@/components/ui/ThemeLogo";
import { useTheme } from "@/context/ThemeContext";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailOrPhone = searchParams.get("emailOrPhone") || "";
  const otp = searchParams.get("otp") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleReset, isLoading } = useResetPassword();
  const { activeTheme } = useTheme();

  useEffect(() => {
    if (!emailOrPhone || !otp) {
      toast.error("Invalid session. Start the forgot password process again.");
      router.push("/forgot-password");
    }
  }, [emailOrPhone, otp, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const validation = passwordSchema.safeParse(password);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    await handleReset({
      emailOrPhone,
      otp,
      newPassword: password,
    });
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 sm:p-8 font-sans w-full">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-bg-secondary rounded-4xl overflow-hidden shadow-2xl border border-border-main font-sans">

        {/* Left Side: Image & Branding */}
        <div className="hidden lg:flex flex-col relative w-1/2 p-10 min-h-[600px] bg-bg-card border-r border-border-main overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1682465083566-b3ff90042708?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            }}
          />


          <Link
            href="/"
            className="relative z-10 flex items-center gap-3 w-fit hover:opacity-80 transition-opacity"
          >
            <ThemeLogo
              width={77}
              height={65}
              imgClassName="object-contain"
              className="w-auto h-[65px] drop-shadow-[0_2px_10px_rgba(var(--primary-rgb),0.15)]"
              style={{ width: "auto", height: "65px" }}
            />
            <span className="text-white text-xl font-bold tracking-tight">Go Partner</span>
          </Link>

          <div className="relative z-10 mt-auto pb-8">
            <div className="flex gap-2 mb-6">
              <div className="w-4 h-1 bg-white/20 rounded-full"></div>
              <div className="w-12 h-1 bg-white rounded-full"></div>
              <div className="w-4 h-1 bg-white/20 rounded-full"></div>
            </div>
            <p className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              Security First
            </p>
            <p className="text-zinc-400 text-lg max-w-md">
              Create a strong password to keep your account safe.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 relative justify-center">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex flex-col items-center gap-2">
              <ThemeLogo
                width={59}
                height={50}
                imgClassName="object-contain"
                className="w-auto h-[50px] drop-shadow-[0_2px_10px_rgba(var(--primary-rgb),0.15)]"
                style={{ width: "auto", height: "50px" }}
              />
              <span className="text-text-main text-lg font-bold">Go Partner</span>
            </Link>
          </div>

          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl font-semibold text-text-main mt-6 mb-2 tracking-tight">
              Create Password
            </h2>
            <p className="text-text-muted text-sm max-w-sm">
              Secure your account with a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
            {/* New Password Field */}
            <div className="relative flex items-center">
              <div className="absolute left-4 text-text-muted">
                <LockIcon className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-base text-text-main text-sm rounded-xl pl-12 pr-12 py-4 outline-none border border-border-main focus:border-primary/50 focus:bg-bg-card transition-all placeholder:text-text-muted/45"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-4 text-text-muted hover:text-text-main transition-colors"
              >
                {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm New Password Field */}
            <div className="relative flex items-center">
              <div className="absolute left-4 text-text-muted">
                <LockIcon className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-bg-base text-text-main text-sm rounded-xl pl-12 pr-12 py-4 outline-none border border-border-main focus:border-primary/50 focus:bg-bg-card transition-all placeholder:text-text-muted/45"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-linear-to-r from-primary to-accent hover:opacity-90 text-white font-semibold rounded-xl py-4 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting..." : "Save Password"}
              </button>
            </div>

            <div className="text-center pt-4">
              <Link href="/login" className="text-text-muted hover:text-primary text-sm flex items-center justify-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Cancel and Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-base flex items-center justify-center"><div className="text-text-main">Loading...</div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
