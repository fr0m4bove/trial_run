// src/components/layout/Header.tsx - Update your existing header
'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'

export function Header() {
  const { user, loading, logout, isAdmin } = useAuth()

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  if (loading) {
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
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        height: '80px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f4b41f',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </header>
    )
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
        
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}>📚</div>
          
          <h1 style={{
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#f4b41f',
            margin: 0,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            letterSpacing: '-0.01em'
          }}>
            Book Sanctuary
          </h1>
        </div>

        {/* Navigation & User Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          
          {/* Navigation Links */}
          {user && (
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <a href="/" style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.95rem',
                color: '#d2bab0',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                border: '1px solid transparent'
              }}>
                Library
              </a>
              
              {isAdmin && (
                <a href="/admin" style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.95rem',
                  color: '#d2bab0',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent'
                }}>
                  Admin
                </a>
              )}
            </nav>
          )}

          {/* User Section */}
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2px solid rgba(244, 180, 31, 0.3)'
                    }}
                  />
                )}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#f4b41f'
                  }}>
                    {user.displayName}
                  </div>
                  {isAdmin && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#bfa094',
                      fontWeight: '500'
                    }}>
                      Administrator
                    </div>
                  )}
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.85rem',
                  color: '#d2bab0',
                  background: 'transparent',
                  border: '1px solid rgba(212, 186, 176, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f4b41f'
                  e.currentTarget.style.color = '#f4b41f'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 186, 176, 0.3)'
                  e.currentTarget.style.color = '#d2bab0'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a href="/auth" style={{ textDecoration: 'none' }}>
              <button style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.9rem',
                color: '#43302b',
                backgroundColor: '#f4b41f',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(244, 180, 31, 0.3)',
                transition: 'all 0.3s ease',
                textShadow: 'none'
              }}>
                Sign In
              </button>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}

// ---