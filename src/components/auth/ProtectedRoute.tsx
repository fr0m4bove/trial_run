// src/components/auth/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { currentUser, loading, authReady, isAdmin } = useAuth()
  const router = useRouter()
  
  console.log("ProtectedRoute - Current User:", currentUser ? "authenticated" : "unauthenticated");
  console.log("ProtectedRoute - Loading:", loading);
  console.log("ProtectedRoute - Auth Ready:", authReady);

  useEffect(() => {
    if (authReady && !loading && !currentUser) {
      console.log("Auth ready but no user detected, redirecting to login");
      router.push('/login');
    } else if (authReady && !loading && currentUser && adminOnly && !isAdmin) {
      router.push('/');
    }
  }, [authReady, loading, currentUser, adminOnly, isAdmin, router]);

  if (loading || !authReady) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#f4b41f' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || (adminOnly && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}

