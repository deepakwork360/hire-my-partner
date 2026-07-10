import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define public auth paths that do not require authentication
  const publicPaths = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'];
  
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  // If the user has no token and is trying to access any page on the website, redirect to /login
  if (!token && !isPublicPath) {
    const url = new URL('/login', request.url);
    // Keep track of the page they wanted to visit
    if (pathname !== '/') {
      url.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(url);
  }

  // If the user has a token and tries to access auth pages, redirect to the home page
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.) with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
