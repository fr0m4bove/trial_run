// /src/components/auth/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (adminOnly && !isAdmin) {
        router.push('/')
      }
    }
  }, [user, loading, isAdmin, adminOnly, router])

  if (loading) {
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
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (adminOnly && !isAdmin)) {
    return null
  }

  return <>{children}</>
}