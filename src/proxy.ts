import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the route patterns that require authentication
const protectedRoutes = [
  "/become-a-partner",
  "/my-booking",
  "/my-earning",
  "/notifications",
  "/account-center",
  "/favourites",
  "/checkout",
  "/booking-confirmation",
  "/send-gift",
  "/send-tip",
  "/profile",
  "/matches",
  "/messages",
  "/settings",
];

// Define auth/verification routes
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Helper function to decode JWT payload safely in Next.js Edge Runtime
function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64URL to Base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

// Helper function to check if a verification status field is truthy/verified
function isVerifiedField(val: any) {
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (typeof val === "string" && val.trim() !== "" && val !== "null") return true;
  return false;
}

// Next.js 16: renamed from `middleware` to `proxy`
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const hasToken = !!token;

  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isVerifyOtpRoute = pathname.startsWith("/verify-otp");

  // If there is a token, check verification status
  let isEmailVerified = true;
  let isPhoneVerified = true;
  let emailOrPhone = "";

  if (hasToken && token) {
    const payload = decodeJwt(token);
    if (payload) {
      const user = payload.user || payload;
      
      isEmailVerified = 
        isVerifiedField(user.is_email_verified) || 
        isVerifiedField(user.email_verified) || 
        isVerifiedField(user.emailVerified) || 
        isVerifiedField(user.email_verified_at);

      isPhoneVerified = 
        isVerifiedField(user.is_phone_verified) || 
        isVerifiedField(user.phone_verified) || 
        isVerifiedField(user.phoneVerified) || 
        isVerifiedField(user.phone_verified_at) ||
        isVerifiedField(user.phone_no_verified_at);
        
      emailOrPhone = user.email || user.phone || user.phone_no || user.emailOrPhone || "";
    }
  }

  const isFullyVerified = isEmailVerified && isPhoneVerified;

  // 1. Unauthenticated users trying to access protected routes -> redirect to login
  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated but unverified users trying to access protected routes -> redirect to OTP verification
  if (isProtectedRoute && hasToken && !isFullyVerified) {
    const verifyUrl = new URL("/verify-otp", request.url);
    verifyUrl.searchParams.set("emailOrPhone", emailOrPhone);
    verifyUrl.searchParams.set("type", "register");
    verifyUrl.searchParams.set("send_via", !isEmailVerified ? "email" : "phone");
    return NextResponse.redirect(verifyUrl);
  }

  // 3. Authenticated and fully verified users trying to access login/register/verify-otp -> redirect to become-a-partner
  if ((isAuthRoute || isVerifyOtpRoute) && hasToken && isFullyVerified) {
    return NextResponse.redirect(new URL("/become-a-partner", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply proxy to all routes except api, _next static files, and public images/assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/|images/).*)"],
};
