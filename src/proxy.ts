import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy() {
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
