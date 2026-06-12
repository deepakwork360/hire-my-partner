"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyOtp, useSendOtp } from "@/modules/auth/hooks";
import { toast } from "@/components/ui/toastStore";
import Image from "next/image";
import ThemeLogo from "@/components/ui/ThemeLogo";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-base flex items-center justify-center"><div className="text-text-main">Loading...</div></div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailOrPhone = searchParams.get("emailOrPhone") || "";
  const type = (searchParams.get("type") as any) || "register";
  const sendVia = (searchParams.get("send_via") as any) || "phone";
  const phoneNo = searchParams.get("phone_no") || "";
  const phoneCountryCode = searchParams.get("phone_country_code") || "";
  const email = searchParams.get("email") || "";
  
  const { activeTheme } = useTheme();
    
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { handleVerify, isLoading } = useVerifyOtp();
  const { handleSendOtp, isLoading: isSendingOtp } = useSendOtp();

  useEffect(() => {
    if (!emailOrPhone && !phoneNo && !email) {
      toast.error("Invalid session. Redirecting to register.");
      router.push("/register");
    }
  }, [emailOrPhone, phoneNo, email, router]);

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
      emailOrPhone: emailOrPhone || phoneNo || email,
      otp: otpString,
      type,
      send_via: sendVia,
      phone_no: phoneNo,
      phone_country_code: phoneCountryCode,
      email: email,
    });
  };

  const handleResend = async () => {
    try {
      await handleSendOtp({
        type,
        send_via: sendVia,
        phone_no: phoneNo,
        phone_country_code: phoneCountryCode,
        email: email,
      });
    } catch (err) {
      // Error toast is handled by useSendOtp hook
    }
  };

  const displayTarget = sendVia === 'phone' && phoneNo 
    ? `${phoneCountryCode} ${phoneNo}`
    : email || emailOrPhone;

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 sm:p-8 font-sans w-full">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-bg-secondary rounded-4xl overflow-hidden shadow-2xl border border-border-main font-sans">
        
        {/* Left Side: Image & Branding */}
        <div className="hidden lg:flex flex-col relative w-1/2 p-10 min-h-[600px] bg-bg-card border-r border-border-main overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url("https://i.pinimg.com/736x/63/af/d8/63afd8ed0ac993e541b4916b29362f2a.jpg")',
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
              Verify Account
            </h2>
            <p className="text-text-muted text-sm max-w-sm">
              Code sent to <span className="text-text-main font-medium">{displayTarget}</span>
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
                  autoFocus={index === 0}
                  className="w-10 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-bg-base text-text-main rounded-xl border border-border-main focus:border-primary/50 focus:bg-bg-card outline-none transition-all"
                />
              ))}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-linear-to-r from-primary to-accent hover:opacity-90 text-white font-semibold rounded-xl py-4 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Confirm Code"}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-text-muted text-sm">
                Didn't receive the code?{" "}
                <button 
                  type="button" 
                  disabled={isSendingOtp}
                  onClick={handleResend}
                  className="text-primary cursor-pointer hover:text-accent hover:underline font-medium ml-1 transition-colors disabled:opacity-50"
                >
                  {isSendingOtp ? "Resending..." : "Resend"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
