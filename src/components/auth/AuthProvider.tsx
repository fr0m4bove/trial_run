// src/components/auth/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup,
  getRedirectResult,
  signOut, 
  GoogleAuthProvider 
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types/user'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const isAdmin = user?.isAdmin || user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Check for redirect result on mount (for redirect flow)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('Redirect sign-in successful:', result.user.email)
          // The auth state change handler will take care of the rest
        }
      } catch (error: any) {
        console.error('Redirect result error:', error)
        // Don't throw, just log - this is expected if no redirect happened
      }
    }
    
    handleRedirectResult()
  }, [])

  useEffect(() => {
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
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              lastLogin: new Date(),
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL || undefined,
            })
            setUser({ ...userData, lastLogin: new Date() })
          } else {
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
    }, (error) => {
      console.error('Auth state change error:', error)
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
      console.log('Starting Google sign-in with popup...');
      const provider = new GoogleAuthProvider();
      
      // Force account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Add scopes
      provider.addScope('profile');
      provider.addScope('email');

      // Try popup first (usually works better)
      try {
        const result = await signInWithPopup(auth, provider);
        console.log('Popup sign-in successful:', result.user.email);
        // The auth state change handler will take care of setting up the user
        return;
      } catch (popupError: any) {
        console.error('Popup sign-in failed:', popupError);
        
        // If popup blocked, inform the user
        if (popupError.code === 'auth/popup-blocked') {
          alert('Pop-up was blocked. Please allow pop-ups for this site and try again.');
          throw popupError;
        }
        
        // For other errors, throw
        throw popupError;
      }
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Authentication failed. ';
      
      if (error.code === 'auth/api-key-not-valid') {
        errorMessage += 'Configuration error. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage += 'Network error. Please check your connection.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage += 'Please allow pop-ups and try again.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      alert(errorMessage);
      throw error;
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
      router.push('/')
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