import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the route patterns for protection
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/matches",
  "/messages",
  "/settings",
];
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

export function middleware(request: NextRequest) {
  // Checking for common httpOnly cookie names injected by backends holding refresh tokens
  const hasToken =
    request.cookies.has("refreshToken") ||
    request.cookies.has("connect.sid") ||
    request.cookies.has("session") ||
    request.cookies.has("token");

  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !hasToken) {
    // Redirect unauthenticated users to login page
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasToken) {
    // Redirect authenticated users away from auth pages to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except api, _next static files, and images
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
