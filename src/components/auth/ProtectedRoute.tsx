// src/components/auth/ProtectedRoute.tsx
'use client'

import { useAuth } from './AuthProvider'
import { LoginForm } from './LoginForm'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-dark-academia-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-academia-700">Loading your sanctuary...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-dark-academia-900 mb-4">
            Access Restricted
          </h1>
          <p className="text-dark-academia-700">
            This area is reserved for library administrators.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// ---