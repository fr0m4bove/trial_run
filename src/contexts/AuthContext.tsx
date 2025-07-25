// /src/contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserData {
  email: string
  displayName: string
  photoURL: string | null
  isAdmin: boolean
  createdAt: Date
  lastLogin: Date
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Get or create user document
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData
          setUserData(data)
          setIsAdmin(data.isAdmin)
          
          // Update last login
          await setDoc(doc(db, 'users', user.uid), {
            ...data,
            lastLogin: new Date()
          })
        } else {
          // Create new user document
          const newUserData: UserData = {
            email: user.email!,
            displayName: user.displayName || user.email!.split('@')[0],
            photoURL: user.photoURL,
            isAdmin: user.email === 'noahriordan31@gmail.com',
            createdAt: new Date(),
            lastLogin: new Date()
          }
          
          await setDoc(doc(db, 'users', user.uid), newUserData)
          setUserData(newUserData)
          setIsAdmin(newUserData.isAdmin)
        }
      } else {
        setUserData(null)
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in:', error)
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

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      isAdmin,
      signInWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}