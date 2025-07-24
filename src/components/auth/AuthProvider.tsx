// src/components/auth/AuthProvider.tsx - Replace your existing file
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
      
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in with Google:', error)
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

// ---