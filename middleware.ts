// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth/auth-service';

export async function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/games', '/profile', '/wallet'];
  const authRoutes = ['/login', '/register', '/onboarding'];
  
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Get session token from cookies
  const sessionToken = request.cookies.get('session')?.value;
  
  let isAuthenticated = false;
  
  if (sessionToken) {
    try {
      const result = await AuthService.validateSession(sessionToken);
      isAuthenticated = result.success;
    } catch (error) {
      console.error('Session validation error:', error);
    }
  }
  
  // If trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If trying to access auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

