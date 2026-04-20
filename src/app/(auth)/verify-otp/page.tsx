"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyOtp } from "@/modules/auth/hooks";
import { verifyOtpSchema } from "@/modules/auth/validation";
import { toast } from "@/components/ui/toastStore";

function FoxLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-orange-500">
      <path d="M12 2L2 9l2 11h16l2-11-10-7z" fill="currentColor" opacity="0.8" />
      <path d="M12 2L2 9l6 4 4-3 4 3 6-4-10-7z" fill="#FFF" opacity="0.3" />
      <path d="M8 13v2H6v-2h2zm10 0v2h-2v-2h2z" fill="#000" opacity="0.5" />
      <circle cx="12" cy="18" r="1.5" fill="#000" opacity="0.8" />
    </svg>
  );
}

import Image from "next/image";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailOrPhone = searchParams.get("emailOrPhone") || "";
  const type = (searchParams.get("type") as any) || "register";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { handleVerify, isLoading } = useVerifyOtp();

  useEffect(() => {
    if (!emailOrPhone) {
      toast.error("Invalid session. Redirecting to register.");
      router.push("/register");
    }
  }, [emailOrPhone, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    await handleVerify({
      emailOrPhone,
      otp: otpString,
      type,
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-[#0E0E10] rounded-4xl overflow-hidden shadow-2xl border border-zinc-800/60 font-sans">
        
        {/* Left Side: Image & Branding */}
        <div className="hidden lg:flex flex-col relative w-1/2 p-10 min-h-[600px] bg-zinc-900 border-r border-zinc-800/60 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-screen"
            style={{ 
              backgroundImage: 'url("auth/otp.jpg")',
              filter: 'saturate(1.2)'
            }}
          />
          <div className="absolute inset-0 z-0 bg-linear-to-t from-[#0E0E10] via-transparent to-transparent opacity-90" />
          
          <div className="relative z-10 flex items-center gap-3">
            <Image src="/auth/logo.webp" alt="Logo" width={65} height={65} />
            <span className="text-white text-xl font-bold tracking-tight">Meet Me</span>
          </div>

          <div className="relative z-10 mt-auto pb-8">
            <div className="flex gap-2 mb-6">
              <div className="w-4 h-1 bg-white/20 rounded-full"></div>
              <div className="w-12 h-1 bg-white rounded-full"></div>
              <div className="w-4 h-1 bg-white/20 rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              One Last Step
            </h1>
            <p className="text-zinc-400 text-lg max-w-md">
              Verify your identity to secure your account.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 relative justify-center">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl font-semibold text-white mt-6 mb-2 tracking-tight">
              Verify Account
            </h2>
            <p className="text-zinc-400 text-sm max-w-sm">
              Code sent to <span className="text-white font-medium">{emailOrPhone}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 max-w-md mx-auto w-full">
            <div className="flex justify-center gap-3 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-[#1A1A1E] text-white rounded-xl border border-transparent focus:border-[#FF0066]/50 focus:bg-[#1f1f24] outline-none transition-all"
                />
              ))}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-[#CF0000] to-[#FF0066] hover:opacity-90 text-white font-semibold rounded-xl py-4 transition-all shadow-[0_4px_20px_rgba(255,0,102,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Confirm Code"}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-zinc-500 text-sm">
                Didn't receive the code?{" "}
                <button type="button" className="text-[#FF0066] hover:underline font-medium ml-1">
                  Resend
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
