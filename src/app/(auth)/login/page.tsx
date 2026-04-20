"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/modules/auth/hooks";
import { loginSchema } from "@/modules/auth/validation";
import { toast } from "@/components/ui/toastStore";
import Image from "next/image";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24"
      height="24"
      className={className}
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      width="24"
      height="24"
      fill="#1877F2"
      className={className}
    >
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      width="24"
      height="24"
      fill="currentColor"
      className={className}
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function FoxLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 text-orange-500"
    >
      <path
        d="M12 2L2 9l2 11h16l2-11-10-7z"
        fill="currentColor"
        opacity="0.8"
      />
      <path d="M12 2L2 9l6 4 4-3 4 3 6-4-10-7z" fill="#FFF" opacity="0.3" />
      <path d="M8 13v2H6v-2h2zm10 0v2h-2v-2h2z" fill="#000" opacity="0.5" />
      <circle cx="12" cy="18" r="1.5" fill="#000" opacity="0.8" />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const { handleLogin, isLoading } = useLogin();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    otp: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    await handleLogin(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row bg-[#0E0E10] rounded-4xl overflow-hidden shadow-2xl border border-zinc-800/60 font-sans">
        {/* Left Side: Image & Branding */}
        <div className="hidden lg:flex flex-col relative w-1/2 p-10 min-h-[500px] bg-zinc-900 border-r border-zinc-800/60 overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-screen"
            style={{
              backgroundImage: 'url("auth/login.jpg")',
              filter: "saturate(1.2)",
            }}
          />
          <div className="absolute inset-0 z-0 bg-linear-to-t from-[#0E0E10] via-transparent to-transparent opacity-90" />

          {/* Logo at Top Left */}
          <Link 
            href="/" 
            className="relative z-10 flex items-center gap-3 w-fit hover:opacity-80 transition-opacity"
          >
            <Image src="/auth/logo.webp" alt="Logo" width={60} height={60} />
            <span className="text-white text-xl font-bold tracking-tight">
              Meet Me
            </span>
          </Link>

          <div className="relative z-10 mt-auto pb-8">
            <div className="flex gap-2 mb-6">
              <div className="w-12 h-1 bg-white rounded-full"></div>
              <div className="w-4 h-1 bg-white/20 rounded-full"></div>
              <div className="w-4 h-1 bg-white/20 rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              Welcome Back
            </h1>
            <p className="text-zinc-400 text-lg max-w-md">
              Login to continue your journey and find your partner.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col w-full lg:w-1/2 p-8 sm:p-12 lg:p-14 relative">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex flex-col items-center gap-2">
              <Image src="/auth/logo.webp" alt="Logo" width={50} height={50} />
              <span className="text-white text-lg font-bold">Meet Me</span>
            </Link>
          </div>

          {/* Top Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#1A1A1E] p-1.5 rounded-full inline-flex">
              <Link
                href="/register"
                className="text-zinc-400 hover:text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="bg-linear-to-r from-[#CF0000] to-[#FF0066] text-white px-8 py-2.5 rounded-full text-sm font-medium transition-all shadow-[0_4px_14px_rgba(255,0,102,0.3)]"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-semibold text-white text-center mb-10 tracking-tight">
            Account Login
          </h2>

          <div className="flex justify-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setLoginMode("password")}
                className={`text-sm ${loginMode === "password" ? "text-[#FF0066] font-semibold" : "text-zinc-500"}`}
              >
                Password Login
              </button>
              <button
                onClick={() => setLoginMode("otp")}
                className={`text-sm ${loginMode === "otp" ? "text-[#FF0066] font-semibold" : "text-zinc-500"}`}
              >
                OTP Login
              </button>
            </div>
          </div>

          <form
            className="space-y-4 max-w-md mx-auto w-full"
            onSubmit={handleSubmit}
          >
            {/* Email/Phone Field */}
            <div className="relative flex items-center">
              <div className="absolute left-4 text-zinc-500">
                <MailIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Enter Email or Phone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className="w-full bg-[#1A1A1E] text-white text-sm rounded-xl pl-12 pr-5 py-3.5 outline-none border border-transparent focus:border-[#FF0066]/50 focus:bg-[#1f1f24] transition-all placeholder:text-zinc-600"
                required
              />
            </div>

            {loginMode === "password" ? (
              <div className="relative flex items-center">
                <div className="absolute left-4 text-zinc-500">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A1E] text-white text-sm rounded-xl pl-12 pr-12 py-3.5 outline-none border border-transparent focus:border-[#FF0066]/50 focus:bg-[#1f1f24] transition-all placeholder:text-zinc-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="relative flex items-center">
                <div className="absolute left-4 text-zinc-500">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A1E] text-white text-sm rounded-xl pl-12 pr-5 py-3.5 outline-none border border-transparent focus:border-[#FF0066]/50 focus:bg-[#1f1f24] transition-all placeholder:text-zinc-600"
                  required
                />
              </div>
            )}

            <div className="flex justify-end pr-1">
              <Link
                href="/forgot-password"
                className="text-xs text-zinc-500 hover:text-[#FF0066]"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-[#CF0000] to-[#FF0066] hover:opacity-90 text-white font-semibold rounded-xl py-3.5 transition-all shadow-[0_4px_20px_rgba(255,0,102,0.4)] hover:shadow-[0_4px_25px_rgba(255,0,102,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login Now"}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center space-x-4 my-8 pb-2 pt-4">
              <div className="h-px bg-zinc-800 w-full"></div>
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                Or
              </span>
              <div className="h-px bg-zinc-800 w-full"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                className="flex items-center justify-center bg-[#1A1A1E] hover:bg-[#25252A] rounded-full py-3 transition-colors border border-transparent hover:border-zinc-800"
              >
                <GoogleIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-[#1A1A1E] hover:bg-[#25252A] rounded-full py-3 transition-colors border border-transparent hover:border-zinc-800"
              >
                <FacebookIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-[#1A1A1E] hover:bg-[#25252A] rounded-full py-3 transition-colors border border-transparent hover:border-zinc-800 text-white"
              >
                <AppleIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-8 text-center text-zinc-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-white hover:text-pink-500 font-medium transition-colors underline underline-offset-4"
              >
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
