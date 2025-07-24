// src/components/auth/LoginForm.tsx - Create this file
'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'

export function LoginForm() {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 50%, rgba(212, 186, 176, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(151, 118, 105, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #2c1810 0%, #43302b 25%, #5d4037 50%, #6d4c41 75%, #8d6e63 100%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '50px', left: '50px', fontSize: '2rem', color: 'rgba(244, 180, 31, 0.6)' }}>❦</div>
      <div style={{ position: 'absolute', bottom: '50px', right: '50px', fontSize: '2rem', color: 'rgba(244, 180, 31, 0.6)', transform: 'rotate(180deg)' }}>❦</div>
      
      <div style={{
        background: 'rgba(253, 248, 246, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '3rem 2.5rem',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(244, 180, 31, 0.2)',
        maxWidth: '400px',
        width: '100%',
        margin: '2rem',
        textAlign: 'center',
        border: '1px solid rgba(244, 180, 31, 0.3)'
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
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#5d4037',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          Your literary haven awaits
        </p>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#333',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = '#f4b41f'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(244, 180, 31, 0.2)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          {isLoading ? (
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #f4b41f',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>
        
        <p style={{
          fontSize: '0.85rem',
          color: '#8d6e63',
          marginTop: '1.5rem',
          fontStyle: 'italic'
        }}>
          "Books are a uniquely portable magic."
        </p>
      </div>
    </div>
  )
}
