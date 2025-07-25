// src/components/auth/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types/user'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.isAdmin || user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    // Check if auth is initialized
    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email || 'No user');
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        try {
          // Get or create user document
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            // Update last login
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              lastLogin: new Date(),
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL || undefined,
            })
            setUser({ ...userData, lastLogin: new Date() })
          } else {
            // Create new user
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || 'Reader',
              photoURL: firebaseUser.photoURL || undefined,
              isAdmin: firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
              preferences: {
                theme: 'dark-academia',
                fontSize: 'medium',
                lineHeight: 'normal',
                readingWidth: 'medium',
              },
              createdAt: new Date(),
              lastLogin: new Date(),
            }
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
            setUser(newUser)
          }
        } catch (error) {
          console.error('Error handling user authentication:', error)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      throw new Error('Authentication service not available');
    }

    try {
      console.log('Starting Google sign-in...');
      const provider = new GoogleAuthProvider();
      
      // Configure the provider
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Try to sign in with popup
      const result = await signInWithPopup(auth, provider);
      console.log('Sign-in successful:', result.user.email);
      
      // The onAuthStateChanged listener will handle the user setup
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to sign in. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Please allow popups for this site';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'This domain is not authorized for sign-in';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google sign-in is not enabled';
          break;
        case 'auth/invalid-api-key':
          errorMessage = 'Invalid configuration. Please contact support.';
          break;
      }
      
      throw new Error(errorMessage);
    }
  }

  const logout = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }

    try {
      await signOut(auth)
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    firebaseUser,
    loading,
    signInWithGoogle,
    logout,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}