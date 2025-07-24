// src/components/auth/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, GoogleAuthProvider, browserPopupRedirectResolver } from 'firebase/auth'
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

  // Check for redirect result on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth, browserPopupRedirectResolver)
        if (result) {
          console.log('Redirect sign-in successful:', result.user.email)
        }
      } catch (error) {
        console.error('Redirect sign-in error:', error)
      }
    }
    checkRedirectResult()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      // Add custom parameters for better error handling
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      // Use browserPopupRedirectResolver as suggested in Stack Overflow
      try {
        const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver)
        console.log('Popup sign-in successful:', result.user.email)
      } catch (popupError: any) {
        console.error('Popup failed:', popupError)
        
        // If popup fails, try redirect with resolver
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('Falling back to redirect sign-in...')
          await signInWithRedirect(auth, provider, browserPopupRedirectResolver)
        } else {
          throw popupError
        }
      }
      
    } catch (error: any) {
      console.error('Error signing in with Google:', error)
      
      // Better error handling
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('User cancelled the sign-in')
      } else if (error.code === 'auth/unauthorized-domain') {
        console.error('This domain is not authorized. Please add it to Firebase Console.')
      } else if (error.code === 'auth/operation-not-allowed') {
        console.error('Google sign-in is not enabled in Firebase Console.')
      }
      
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
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