import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/landing',
  ];

  if (publicPaths.includes(pathname) || pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  // Check for token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
