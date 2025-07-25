// src/components/layout/Header.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export function Header() {
  const { currentUser, userData, loading, logout, isAdmin } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(44, 24, 16, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(244, 180, 31, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none'
        }}>
          <div style={{ fontSize: '1.5rem' }}>📚</div>
          <h1 style={{
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#f4b41f',
            margin: 0
          }}>
            Book Sanctuary
          </h1>
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {currentUser && (
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <Link href="/" style={{
                color: '#d2bab0',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Library
              </Link>
              
              {isAdmin && (
                <>
                  <Link href="/admin" style={{
                    color: '#d2bab0',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}>
                    Admin
                  </Link>
                  <Link href="/admin/books/new" style={{
                    color: '#d2bab0',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}>
                    Upload Book
                  </Link>
                </>
              )}
            </nav>
          )}

          {loading ? (
            <div style={{ color: '#d2bab0' }}>Loading...</div>
          ) : currentUser ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {userData?.photoURL && (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid rgba(244, 180, 31, 0.3)'
                  }}
                />
              )}
              <div>
                <div style={{ color: '#f4b41f', fontSize: '0.9rem' }}>
                  {userData?.displayName}
                </div>
                {isAdmin && (
                  <div style={{ color: '#bfa094', fontSize: '0.75rem' }}>
                    Administrator
                  </div>
                )}
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  color: '#d2bab0',
                  background: 'transparent',
                  border: '1px solid rgba(212, 186, 176, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button style={{
                color: '#43302b',
                backgroundColor: '#f4b41f',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
