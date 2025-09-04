// JWT Logout API Route
// Location: src/app/api/auth/logout/route.ts
// Purpose: Handle user logout and invalidate JWT sessions

import { NextRequest, NextResponse } from 'next/server';
import { JWTSessionManager, TokenStorage } from '@/lib/jwt-auth';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const accessToken = request.cookies.get('access_token')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '');

    if (accessToken) {
      const sessionManager = JWTSessionManager.getInstance();
      const payload = await sessionManager.verifyToken(accessToken);
      
      if (payload && payload.sessionId) {
        // Invalidate the specific session
        await sessionManager.invalidateSession(payload.sessionId);
      }
    }

    // Clear cookies
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
