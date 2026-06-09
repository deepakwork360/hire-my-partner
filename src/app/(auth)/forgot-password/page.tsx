"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForgotPassword } from "@/modules/auth/hooks";
import { toast } from "@/components/ui/toastStore";

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

// function FoxLogo() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-orange-500">
//       <path d="M12 2L2 9l2 11h16l2-11-10-7z" fill="currentColor" opacity="0.8" />
//       <path d="M12 2L2 9l6 4 4-3 4 3 6-4-10-7z" fill="#FFF" opacity="0.3" />
//       <path d="M8 13v2H6v-2h2zm10 0v2h-2v-2h2z" fill="#000" opacity="0.5" />
//       <circle cx="12" cy="18" r="1.5" fill="#000" opacity="0.8" />
//     </svg>
//   );
// }

import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

const logoMapping: Record<string, string> = {
  rose: "/auth/rosego1.png",
  gold: "/auth/goldgo.png",
  emerald: "/auth/emeraldgo.png",
  violet: "/auth/violetgo.png",
  cyan: "/auth/cyango.png",
};

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const { handleForgot, isLoading } = useForgotPassword();
  const { activeTheme } = useTheme();
  const logoSrc = logoMapping[activeTheme] || "/auth/rose.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      toast.error("Please enter your email or phone");
      return;
    }
    await handleForgot({ emailOrPhone });
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 sm:p-8 font-sans w-full">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-bg-secondary rounded-4xl overflow-hidden shadow-2xl border border-border-main font-sans">
        {/* Left Side: Image & Branding */}
        <div className="hidden lg:flex flex-col relative w-1/2 p-10 min-h-[600px] bg-bg-card border-r border-border-main overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://i1-e.pinimg.com/1200x/5a/f2/8a/5af28ad0a4feee85bb9038e64ee2455f.jpg")',
            }}
          />


          <Link
            href="/"
            className="relative z-10 flex items-center gap-3 w-fit hover:opacity-80 transition-opacity"
          >
            <Image
              src={logoSrc}
              alt="Logo"
              width={77}
              height={65}
              className="w-auto h-[65px] object-contain drop-shadow-[0_2px_10px_rgba(var(--primary-rgb),0.15)]"
              style={{ width: "auto", height: "65px" }}
            />
            <span className="text-white text-xl font-bold tracking-tight">
              Go Partner
            </span>
          </Link>

          <div className="relative z-10 mt-auto pb-8">
            <div className="flex gap-2 mb-6">
              <div className="w-12 h-1 bg-white rounded-full"></div>
              <div className="w-4 h-1 bg-white/20 rounded-full"></div>
              <div className="w-4 h-1 bg-white/20 rounded-full"></div>
            </div>
            {/* <p className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              Password Recovery
            </p>
            <p className="text-zinc-400 text-lg max-w-md">
              We'll help you get back into your account in no time.
            </p> */}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 relative justify-center">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex flex-col items-center gap-2">
              <Image
                src={logoSrc}
                alt="Logo"
                width={59}
                height={50}
                className="w-auto h-[50px] object-contain drop-shadow-[0_2px_10px_rgba(var(--primary-rgb),0.15)]"
                style={{ width: "auto", height: "50px" }}
              />
              <span className="text-text-main text-lg font-bold">Go Partner</span>
            </Link>
          </div>

          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl font-semibold text-text-main mt-6 mb-2 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-text-muted text-sm max-w-sm">
              Enter your details to receive a verification code.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-md mx-auto"
          >
            {/* Email/Phone Field */}
            <div className="relative flex items-center">
              <div className="absolute left-4 text-text-muted">
                <MailIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-bg-base text-text-main text-sm rounded-xl pl-12 pr-5 py-4 outline-none border border-border-main focus:border-primary/50 focus:bg-bg-card transition-all placeholder:text-text-muted/45"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-linear-to-r from-primary to-accent hover:opacity-90 text-white font-semibold rounded-xl py-4 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending Code..." : "Send Request"}
              </button>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/login"
                className="text-text-muted hover:text-primary text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
