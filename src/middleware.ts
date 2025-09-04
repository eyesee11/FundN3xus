// Simplified Middleware for Firebase Auth
// Location: src/middleware.ts
// Purpose: Basic route protection without JWT (Firebase Auth handles authentication)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected and public routes
const protectedRoutes = [
  '/dashboard',
  '/affordability',
  '/investments',
  '/scenarios',
  '/profile',
  '/settings',
  '/ai-chat'
];

const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // For now, let Firebase Auth handle authentication in the client
  // JWT middleware can be enabled later when JWT auth is fully integrated
  
  // Allow all routes to pass through
  // Firebase Auth will handle protection on the client side
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except static files, API routes, and _next
    '/((?!api|_next/static|_next/image|favicon.ico|banner.png|banner2.png|bannerLogin.svg).*)',
  ],
};
