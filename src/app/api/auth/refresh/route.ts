// JWT Token Refresh API Route
// Location: src/app/api/auth/refresh/route.ts
// Purpose: Refresh access tokens using refresh tokens

import { NextRequest, NextResponse } from 'next/server';
import { JWTSessionManager } from '@/lib/jwt-auth';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie or body
    const refreshToken = request.cookies.get('refresh_token')?.value || 
                        (await request.json()).refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not provided' },
        { status: 400 }
      );
    }

    // Refresh the access token
    const sessionManager = JWTSessionManager.getInstance();
    const newAccessToken = await sessionManager.refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Return new access token
    const response = NextResponse.json(
      { 
        success: true,
        accessToken: newAccessToken 
      },
      { status: 200 }
    );

    // Update access token cookie
    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    );
  }
}
