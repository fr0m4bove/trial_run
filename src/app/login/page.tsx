// src/app/login/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { currentUser, loading, authReady, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authReady && currentUser) {
      console.log("User already authenticated, redirecting to home");
      router.push('/');
    }
  }, [authReady, currentUser, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      router.push('/')
    } catch (error: any) {
      alert(error.message || 'Failed to sign in')
    }
  }

  if (!authReady || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2c1810 0%, #43302b 25%, #5d4037 50%, #6d4c41 75%, #8d6e63 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#f4b41f' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
          <p>Checking authentication status...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2c1810 0%, #43302b 25%, #5d4037 50%, #6d4c41 75%, #8d6e63 100%)'
    }}>
      <div style={{
        background: 'rgba(253, 248, 246, 0.95)',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '100%',
        margin: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📚</div>
        
        <h1 style={{
          fontFamily: 'Crimson Text, Georgia, serif',
          fontSize: '2rem',
          fontWeight: '700',
          color: '#43302b',
          marginBottom: '0.5rem'
        }}>
          Welcome to Book Sanctuary
        </h1>
        
        <p style={{
          color: '#5d4037',
          marginBottom: '2rem'
        }}>
          Sign in to access your literary haven
        </p>
        
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#333',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f4b41f'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}
