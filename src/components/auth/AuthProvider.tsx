// src/components/auth/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithRedirect,
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

  // Check for redirect result on mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('Redirect sign-in successful:', result.user.email)
          // Redirect to home page after successful sign-in
          router.push('/')
        }
      } catch (error: any) {
        console.error('Redirect result error:', error)
        if (error.code === 'auth/invalid-api-key') {
          console.error('Invalid API key - check Vercel environment variables')
        }
      }
    }
    
    handleRedirectResult()
  }, [router])

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
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      throw new Error('Authentication service not available');
    }

    try {
      console.log('Starting Google sign-in with redirect...');
      const provider = new GoogleAuthProvider();
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Use redirect instead of popup
      await signInWithRedirect(auth, provider);
      // User will be redirected to Google, then back to your app
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
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