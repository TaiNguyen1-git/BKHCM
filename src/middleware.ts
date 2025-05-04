import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is an example of how you could protect routes
export function middleware(request: NextRequest) {
  // Example: Check if user is authenticated
  const isAuthenticated = request.cookies.has('auth-token');
  
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Example protected routes
  const protectedPaths = ['/dashboard', '/profile', '/admin'];
  
  // Check if the pathname is a protected route
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // If it's a protected route and the user is not authenticated
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    // Add the original URL as a parameter to redirect after login
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// This specifies which paths the middleware should run on
export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    // You can add more patterns here
  ],
}; 