// JWT Authentication API Route
// Location: src/app/api/auth/login/route.ts
// Purpose: Handle user login and generate JWT tokens

import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { JWTSessionManager } from '@/lib/jwt-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate JWT tokens
    const sessionManager = JWTSessionManager.getInstance();
    const tokens = await sessionManager.generateTokenPair({
      userId: user.uid,
      email: user.email || email,
      role: 'user', // Default role, can be fetched from Firestore
    });

    // Set httpOnly cookies for better security
    const response = NextResponse.json(
      { 
        success: true, 
        user: {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
        tokens 
      },
      { status: 200 }
    );

    // Set secure cookies
    response.cookies.set('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    response.cookies.set('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
