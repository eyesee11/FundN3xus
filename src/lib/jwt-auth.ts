// JWT Token Management Utility
// Location: src/lib/jwt-auth.ts
// Purpose: Handle JWT token generation, validation, and session management

import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const JWT_ISSUER = 'fundn3xus';
const JWT_AUDIENCE = 'fundn3xus-users';

// Token Types
export interface JWTPayload {
  userId: string;
  email?: string;
  role?: 'user' | 'advisor' | 'admin';
  sessionId: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Session Management Class
export class JWTSessionManager {
  private static instance: JWTSessionManager;
  private activeSessions: Map<string, { userId: string; createdAt: Date; lastActivity: Date }> = new Map();

  public static getInstance(): JWTSessionManager {
    if (!JWTSessionManager.instance) {
      JWTSessionManager.instance = new JWTSessionManager();
    }
    return JWTSessionManager.instance;
  }

  /**
   * Generate JWT token pair (access + refresh tokens)
   */
  async generateTokenPair(payload: Omit<JWTPayload, 'sessionId' | 'iat' | 'exp' | 'iss' | 'aud'>): Promise<TokenPair> {
    const sessionId = nanoid();
    const now = Math.floor(Date.now() / 1000);

    // Create access token (15 minutes)
    const accessToken = await new SignJWT({ 
      ...payload, 
      sessionId,
      type: 'access'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + 15 * 60) // 15 minutes
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .sign(JWT_SECRET);

    // Create refresh token (7 days)
    const refreshToken = await new SignJWT({ 
      userId: payload.userId,
      sessionId,
      type: 'refresh'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + 7 * 24 * 60 * 60) // 7 days
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .sign(JWT_SECRET);

    // Store session
    this.activeSessions.set(sessionId, {
      userId: payload.userId,
      createdAt: new Date(),
      lastActivity: new Date()
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verify and decode JWT token
   */
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });

      const jwtPayload = payload as unknown as JWTPayload;

      // Check if session is still active
      if (jwtPayload.sessionId && this.activeSessions.has(jwtPayload.sessionId)) {
        // Update last activity
        const session = this.activeSessions.get(jwtPayload.sessionId)!;
        session.lastActivity = new Date();
        
        return jwtPayload;
      }

      return null;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const payload = await this.verifyToken(refreshToken);
      
      if (!payload || payload.type !== 'refresh') {
        return null;
      }

      // Generate new access token
      const now = Math.floor(Date.now() / 1000);
      const accessToken = await new SignJWT({
        userId: payload.userId,
        sessionId: payload.sessionId,
        type: 'access'
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt(now)
        .setExpirationTime(now + 15 * 60) // 15 minutes
        .setIssuer(JWT_ISSUER)
        .setAudience(JWT_AUDIENCE)
        .sign(JWT_SECRET);

      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  /**
   * Invalidate session (logout)
   */
  async invalidateSession(sessionId: string): Promise<boolean> {
    return this.activeSessions.delete(sessionId);
  }

  /**
   * Invalidate all sessions for a user
   */
  async invalidateAllUserSessions(userId: string): Promise<number> {
    let count = 0;
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.userId === userId) {
        this.activeSessions.delete(sessionId);
        count++;
      }
    }
    return count;
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions(): number {
    const now = new Date();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    let cleaned = 0;

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > maxAge) {
        this.activeSessions.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get active session count for user
   */
  getUserSessionCount(userId: string): number {
    let count = 0;
    for (const session of this.activeSessions.values()) {
      if (session.userId === userId) {
        count++;
      }
    }
    return count;
  }
}

// Token Storage Utilities for Frontend
export class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'fundn3xus_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'fundn3xus_refresh_token';

  /**
   * Store token pair in secure storage
   */
  static storeTokens(tokens: TokenPair): void {
    if (typeof window !== 'undefined') {
      // Use httpOnly cookies in production for better security
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  /**
   * Get access token from storage
   */
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Get refresh token from storage
   */
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Clear all tokens from storage
   */
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  /**
   * Check if tokens exist in storage
   */
  static hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}

// Auto-refresh token hook for React components
export function useTokenRefresh() {
  const refreshToken = async (): Promise<boolean> => {
    const refreshTokenValue = TokenStorage.getRefreshToken();
    if (!refreshTokenValue) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        TokenStorage.storeTokens({ 
          accessToken, 
          refreshToken: refreshTokenValue 
        });
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  };

  return { refreshToken };
}

// API Request Interceptor with Auto-Refresh
export class AuthenticatedAPI {
  private static sessionManager = JWTSessionManager.getInstance();

  /**
   * Make authenticated API request with auto-refresh
   */
  static async request(url: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = TokenStorage.getAccessToken();

    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    let response = await fetch(url, { ...options, headers });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      const refreshTokenValue = TokenStorage.getRefreshToken();
      if (refreshTokenValue) {
        const newAccessToken = await this.sessionManager.refreshAccessToken(refreshTokenValue);
        
        if (newAccessToken) {
          TokenStorage.storeTokens({ 
            accessToken: newAccessToken, 
            refreshToken: refreshTokenValue 
          });

          // Retry original request with new token
          const newHeaders = {
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json',
          };

          response = await fetch(url, { ...options, headers: newHeaders });
        } else {
          // Refresh failed, redirect to login
          TokenStorage.clearTokens();
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        TokenStorage.clearTokens();
        window.location.href = '/login';
      }
    }

    return response;
  }
}

export default JWTSessionManager;
