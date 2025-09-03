'use client'

// Auth context - managing user sessions like a boss 💪
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isNewUser: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  clearNewUserFlag: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use the auth context - makes life easier ✨
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth provider component - wraps our app with auth powers 🚀
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  // Sign in with email and password - classic approach 📧
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  // Sign up with email and password - welcome new users! 🎉
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName })
      }
      
      // Mark as new user for redirect to settings
      setIsNewUser(true)
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Google sign in - one click magic ⚡
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Check if this is a new user (first time signing in with Google)
      // We check if creation time and last sign in time are very close (within 5 seconds)
      const creationTime = new Date(result.user.metadata.creationTime!).getTime()
      const lastSignInTime = new Date(result.user.metadata.lastSignInTime!).getTime()
      const isFirstTimeUser = Math.abs(creationTime - lastSignInTime) < 5000
      
      if (isFirstTimeUser) {
        setIsNewUser(true)
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  // Sign out - bye bye! 👋
  const logout = async () => {
    try {
      await signOut(auth)
      setIsNewUser(false) // Reset new user flag
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Reset password - send reset email 📧
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  // Clear new user flag - called after user completes settings
  const clearNewUserFlag = () => {
    setIsNewUser(false)
  }

  // Listen for auth state changes - keeps us in sync 🔄
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    isNewUser,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    logout,
    clearNewUserFlag
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
