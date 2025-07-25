// src/contexts/AuthContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged, 
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  email: string;
  displayName: string;
  photoURL: string | null;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  authReady: boolean;
  isAdmin: boolean;
  isAuthenticated: () => boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUsername: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user ? "authenticated" : "unauthenticated");
      
      if (user) {
        // Get or create user document
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          
          // Update last login
          await setDoc(doc(db, 'users', user.uid), {
            ...data,
            lastLogin: new Date()
          });
        } else {
          // Create new user document
          const newUserData: UserData = {
            email: user.email!,
            displayName: user.displayName || user.email!.split('@')[0],
            photoURL: user.photoURL,
            isAdmin: user.email === 'noahriordan31@gmail.com', // Your admin email
            createdAt: new Date(),
            lastLogin: new Date()
          };
          
          await setDoc(doc(db, 'users', user.uid), newUserData);
          setUserData(newUserData);
        }
      } else {
        setUserData(null);
      }
      
      setCurrentUser(user);
      setLoading(false);
      setAuthReady(true);
    }, (error) => {
      console.error("Auth state observer error:", error);
      setLoading(false);
      setAuthReady(true);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUsername = async (username: string) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: username
        });
        setCurrentUser({ ...currentUser });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating username:", error);
      return false;
    }
  };

  const isAuthenticated = () => {
    return !!currentUser;
  };

  const isAdmin = userData?.isAdmin || false;

  const value = {
    currentUser,
    userData,
    loading,
    authReady,
    isAdmin,
    isAuthenticated,
    signInWithGoogle,
    logout,
    updateUsername
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
